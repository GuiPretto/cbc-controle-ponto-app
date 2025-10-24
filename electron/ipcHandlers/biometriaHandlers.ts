import { ipcMain } from "electron";
import BiometriaService from "../services/BiometriaService";

const biometriaService = new BiometriaService();

const biometriaHandlers = () => {
  ipcMain.handle(
    "biometria:register",
    (_, idUsuario: number, template: string) =>
      biometriaService.register({ idUsuario, template })
  );
};

export default biometriaHandlers;
