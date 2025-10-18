import { ipcMain } from "electron";
import BaseApiService from "../../electron/services/BaseApiService";

const baseApiService = new BaseApiService();

const authHandlers = () => {
  ipcMain.handle("auth:login", (event, username: string, password: string) =>
    baseApiService.performLogin(username, password)
  );

  ipcMain.handle("auth:logout", () => baseApiService.performLogout());

  ipcMain.handle("auth:check-token", () => baseApiService.checkStoredToken());
};

export default authHandlers;
