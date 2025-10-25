import { ipcMain } from "electron";
import JustificativaService, {
  RegisterJustificativaDto,
} from "../services/JustificativaService";

const justificativaService = new JustificativaService();

const justificativaHandlers = () => {
  ipcMain.handle(
    "justificativa:register",
    (_, params: RegisterJustificativaDto) =>
      justificativaService.register(params)
  );
};

export default justificativaHandlers;
