import { app, BrowserWindow, nativeTheme } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import ipcHandlers from "./ipcHandlers";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

let win: BrowserWindow | null;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let fingerprintProcess: import("child_process").ChildProcess | null = null;

export function setFingerprintProcess(
  proc: import("child_process").ChildProcess
) {
  fingerprintProcess = proc;
}

function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 720,
    minWidth: 1024,
    minHeight: 720,
    icon: path.join(__dirname, "public", "icons", "icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  nativeTheme.on("updated", () => {
    win?.webContents.send(
      "system-theme-changed",
      nativeTheme.shouldUseDarkColors
    );
  });

  if (VITE_DEV_SERVER_URL) win.loadURL(VITE_DEV_SERVER_URL);
  else win.loadFile(path.join(RENDERER_DIST, "index.html"));
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(() => {
  createWindow();
  ipcHandlers(win, setFingerprintProcess);
});
