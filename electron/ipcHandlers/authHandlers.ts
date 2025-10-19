import { BrowserWindow, ipcMain } from "electron";
import BaseApiService, {
  setLogoutTrigger,
} from "../../electron/services/BaseApiService";

const baseApiService = new BaseApiService();

const sendLogoutEvent = () => {
  const window = BrowserWindow.getAllWindows()[0];
  if (window && !window.isDestroyed()) {
    window.webContents.send("auth:logout-forced");
  }
};

setLogoutTrigger(sendLogoutEvent);

const authHandlers = () => {
  ipcMain.handle("auth:login", (_, username: string, password: string) =>
    baseApiService.performLogin(username, password)
  );

  ipcMain.handle("auth:logout", () => baseApiService.performLogout());

  ipcMain.handle("auth:check-token", () => baseApiService.checkStoredToken());
};

export default authHandlers;
