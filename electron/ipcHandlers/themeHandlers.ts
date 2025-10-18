import { ipcMain, nativeTheme } from "electron";

const themeHandlers = () => {
  ipcMain.handle("get-system-theme", () => {
    return nativeTheme.shouldUseDarkColors;
  });
};

export default themeHandlers;
