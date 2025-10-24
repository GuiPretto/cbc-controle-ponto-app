import { ipcMain, app, BrowserWindow } from "electron";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let fingerprintProcess: import("child_process").ChildProcess | null = null;

function isProcessAlive(pid: number) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function forceKillProcess(proc: import("child_process").ChildProcess | null) {
  if (proc && proc.pid) {
    try {
      const pid = proc.pid;
      try {
        process.kill(pid, 0);
      } catch {
        console.log(
          `[FINGERPRINT] Processo ${pid} já finalizado, ignorando taskkill.`
        );
        return;
      }
      console.warn(`[FINGERPRINT] Forçando encerramento do processo ${pid}...`);
      spawn("taskkill", ["/PID", pid.toString(), "/T", "/F"], {
        windowsHide: true,
      });
    } catch (e) {
      console.error("[FINGERPRINT] Erro ao encerrar processo biométrico:", e);
    }
  }
}

async function startFingerprint(exePath: string) {
  console.log("[FINGERPRINT] Iniciando processo:", exePath);

  const proc = spawn(exePath, [], {
    windowsHide: true,
    stdio: ["pipe", "pipe", "pipe"],
  });

  // proc.stderr?.on("data", (err) => {
  //   console.error("[FINGERPRINT][ERRO]", err.toString());
  // });

  proc.on("exit", (code) => {
    console.log("[FINGERPRINT] Processo finalizado com código:", code);
  });

  return proc;
}

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

    const exePath =
      process.env.NODE_ENV === "development"
        ? path.join(__dirname, "../electron/bin/CaptureFingerprint.exe")
        : path.join(process.resourcesPath, "bin", "CaptureFingerprint.exe");

    fingerprintProcess = await startFingerprint(exePath);
    setFingerprintProcess(fingerprintProcess);

    const safeSend = (channel: string, data: unknown) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(channel, data);
      }
    };

    // --- buffer para juntar as mensagens JSON grandes ---
    let buffer = "";

    fingerprintProcess.stdout?.on("data", (chunk) => {
      const text = chunk.toString();

      buffer += text;

      // Tenta detectar JSONs completos (terminam com `}`)
      let boundary: number;
      while (
        (boundary = buffer.indexOf("}\n")) !== -1 ||
        (boundary = buffer.indexOf("}")) !== -1
      ) {
        const jsonStr = buffer.slice(0, boundary + 1);
        buffer = buffer.slice(boundary + 1);

        try {
          const parsed = JSON.parse(jsonStr);
          const res = {
            template: parsed.templateBase64,
          };
          safeSend("fingerprint:data", res);
          console.log("[FINGERPRINT][DATA]", res);
        } catch {
          // ainda não completou o JSON
          // mantemos o buffer e esperamos o próximo pedaço
        }
      }
    });

    fingerprintProcess.stderr?.on("data", (err) => {
      safeSend("fingerprint:error", err.toString());
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
