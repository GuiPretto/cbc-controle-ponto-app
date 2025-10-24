import { ipcMain } from "electron";
import FrequenciaService from "../services/FrequenciaService";

const frequenciaService = new FrequenciaService();

const frequenciaHandlers = () => {
  ipcMain.handle(
    "frequencia:get-by-user-period",
    (_, idUsuario: number, mesAno: string) =>
      frequenciaService.getByUserAndPeriod(idUsuario, mesAno)
  );
};

export default frequenciaHandlers;
