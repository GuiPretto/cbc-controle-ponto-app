import { app, BrowserWindow, nativeTheme } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import ipcHandlers from "./ipcHandlers";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  console.log(process.env.VITE_PUBLIC);
  win = new BrowserWindow({
    width: 1024,
    height: 720,
    minWidth: 1024,
    minHeight: 720,
    icon: "./public/icons/icon.png",
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      // Manter contextIsolation: true e nodeIntegration: false para segurança
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  nativeTheme.on("updated", () => {
    win?.webContents.send(
      "system-theme-changed",
      nativeTheme.shouldUseDarkColors
    );
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  ipcHandlers();
  createWindow();
});
