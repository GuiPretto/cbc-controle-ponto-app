import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

let fingerprintProcess: import("child_process").ChildProcess | null = null;

/** Verifica se o processo ainda está vivo */
function isProcessAlive(pid: number) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/** Força o encerramento de um processo via taskkill */
function forceKillProcess(proc: import("child_process").ChildProcess | null) {
  if (proc && proc.pid) {
    try {
      const pid = proc.pid;
      try {
        process.kill(pid, 0);
      } catch {
        console.log(`[FINGERPRINT] Processo ${pid} já finalizado.`);
        return;
      }
      console.warn(`[FINGERPRINT] Forçando encerramento do processo ${pid}...`);
      spawn("taskkill", ["/PID", pid.toString(), "/T", "/F"], {
        windowsHide: true,
      });
    } catch (e) {
      console.error("[FINGERPRINT] Erro ao encerrar processo:", e);
    }
  }
}

/** Inicia o processo biométrico */
async function startFingerprint(exePath: string) {
  console.log("[FINGERPRINT] Tentando iniciar:", exePath);

  if (!fs.existsSync(exePath)) {
    const msg = `Arquivo de captura de digital não encontrado em:\n${exePath}`;
    console.error("[FINGERPRINT] ERRO:", msg);
    dialog.showErrorBox("Erro ao iniciar captura biométrica", msg);
    throw new Error(msg);
  }

  try {
    const proc = spawn(exePath, [], {
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });

    proc.on("error", (err) => {
      console.error("[FINGERPRINT] Falha ao iniciar processo:", err);
      dialog.showErrorBox(
        "Falha ao iniciar biometria",
        `Não foi possível executar o programa:\n${exePath}\n\nErro: ${err.message}`
      );
    });

    proc.on("exit", (code) => {
      console.log("[FINGERPRINT] Processo finalizado com código:", code);
    });

    return proc;
  } catch (err: any) {
    console.error("[FINGERPRINT] Erro inesperado:", err);
    dialog.showErrorBox(
      "Erro inesperado",
      `Falha ao iniciar o executável biométrico:\n${exePath}\n\n${err.message}`
    );
    throw err;
  }
}

/** Finaliza o processo com shutdown limpo ou forçado */
async function shutdownFingerprint(
  proc: import("child_process").ChildProcess | null
) {
  if (!proc || !proc.pid) {
    console.warn(
      "[FINGERPRINT] Nenhum processo biométrico ativo para desligar."
    );
    return;
  }

  console.log(
    `[FINGERPRINT] Solicitando desligamento limpo do PID ${proc.pid}...`
  );

  try {
    proc.stdin?.write("STOP\r\n");
    proc.stdin?.end();
  } catch (e) {
    console.warn("[FINGERPRINT] Falha ao enviar STOP via stdin:", e);
  }

  const start = Date.now();
  while (Date.now() - start < 5000) {
    if (!isProcessAlive(proc.pid)) {
      console.log("[FINGERPRINT] Processo encerrou normalmente.");
      return;
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  console.warn(
    "[FINGERPRINT] Processo ainda vivo após STOP, forçando encerramento..."
  );
  forceKillProcess(proc);
}

/** Handlers IPC */
const fingerprintHandlers = (
  mainWindow: BrowserWindow | null,
  setFingerprintProcess: (
    proc: import("child_process").ChildProcess | null
  ) => void
) => {
  ipcMain.handle("fingerprint:start", async () => {
    if (fingerprintProcess && isProcessAlive(fingerprintProcess.pid!)) {
      console.warn("[FINGERPRINT] Processo já ativo.");
      throw new Error("Processo já iniciado");
    }

    const isDev = !app.isPackaged;
    const exePath = isDev
      ? path.join(process.cwd(), "electron/bin/CaptureFingerprint.exe")
      : path.join(process.resourcesPath, "bin", "CaptureFingerprint.exe");

    console.log("[FINGERPRINT] Caminho do executável:", exePath);

    fingerprintProcess = await startFingerprint(exePath);
    setFingerprintProcess(fingerprintProcess);

    const safeSend = (channel: string, data: unknown) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(channel, data);
      }
    };

    // --- buffer para juntar mensagens JSON longas vindas do .exe ---
    let buffer = "";

    fingerprintProcess.stdout?.on("data", (chunk) => {
      const text = chunk.toString();
      buffer += text;

      let boundary: number;
      while (
        (boundary = buffer.indexOf("}\n")) !== -1 ||
        (boundary = buffer.indexOf("}")) !== -1
      ) {
        const jsonStr = buffer.slice(0, boundary + 1);
        buffer = buffer.slice(boundary + 1);

        try {
          const parsed = JSON.parse(jsonStr);
          safeSend("fingerprint:data", { template: parsed.templateBase64 });
          console.log("[FINGERPRINT][DATA]", parsed);
        } catch {
          // JSON incompleto, espera o próximo chunk
        }
      }
    });

    fingerprintProcess.stderr?.on("data", (err) => {
      const msg = err.toString();
      console.error("[FINGERPRINT][stderr]", msg);
      safeSend("fingerprint:error", msg);
    });

    fingerprintProcess.on("exit", (code) => {
      console.log("[FINGERPRINT] Finalizado com código:", code);
      safeSend("fingerprint:stopped", { code });
      fingerprintProcess = null;
      setFingerprintProcess(null);
    });

    return { success: true };
  });

  ipcMain.handle("fingerprint:stop", async () => {
    if (fingerprintProcess) {
      console.log("[FINGERPRINT] Encerrando processo manualmente...");
      await shutdownFingerprint(fingerprintProcess);
      fingerprintProcess = null;
      setFingerprintProcess(null);
    }
    return { stopped: true };
  });

  app.on("before-quit", async (e) => {
    if (fingerprintProcess) {
      console.log("[FINGERPRINT] Encerrando (before-quit)...");
      e.preventDefault();
      await shutdownFingerprint(fingerprintProcess);
      fingerprintProcess = null;
      setFingerprintProcess(null);
      console.log("[FINGERPRINT] Encerramento completo, saindo do app...");
      app.exit(0);
    }
  });
};

export default fingerprintHandlers;
