import { ipcMain, dialog } from "electron";
import fs from "fs";

const downloadHandlers = () => {
  ipcMain.handle("download:save-pdf", async (_, data, defaultName) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: defaultName,
      filters: [{ name: "PDF Documents", extensions: ["pdf"] }],
    });

    if (canceled || !filePath) {
      return { success: false, error: "Download cancelado." };
    }

    try {
      fs.writeFileSync(filePath, Buffer.from(data));
      return { success: true, filePath };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });
};

export default downloadHandlers;
