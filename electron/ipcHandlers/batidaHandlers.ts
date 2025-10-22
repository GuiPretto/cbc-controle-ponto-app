import { ipcMain } from "electron";
import BatidaService from "../services/BatidaService";

const batidaService = new BatidaService();

const batidaHandlers = () => {
  ipcMain.handle("batida:register", (_, template: string) =>
    batidaService.register(template)
  );
};

export default batidaHandlers;
