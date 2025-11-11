import { ipcMain } from "electron";
import JustificativaService, {
  RegisterJustificativaDto,
  UpdateJustificativaDto,
} from "../services/JustificativaService";

const justificativaService = new JustificativaService();

const justificativaHandlers = () => {
  ipcMain.handle(
    "justificativa:get-by-user-and-date",
    (_, idUsuario: number, data: string) =>
      justificativaService.getByUserAndDate(idUsuario, data)
  );
  ipcMain.handle(
    "justificativa:register",
    (_, params: RegisterJustificativaDto) =>
      justificativaService.register(params)
  );
  ipcMain.handle("justificativa:update", (_, params: UpdateJustificativaDto) =>
    justificativaService.update(params)
  );
  ipcMain.handle("justificativa:delete", (_, idJustificativa: number) =>
    justificativaService.delete(idJustificativa)
  );
};

export default justificativaHandlers;
