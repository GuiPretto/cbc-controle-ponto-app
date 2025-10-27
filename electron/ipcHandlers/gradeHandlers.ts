import { ipcMain } from "electron";
import GradeService, {
  GradePageParams,
  RegisterGradeDto,
  UpdateGradeDto,
} from "../services/GradeService";

const gradeService = new GradeService();

const gradeHandlers = () => {
  ipcMain.handle("grade:get", (_, idGrade: number) =>
    gradeService.get(idGrade)
  );
  ipcMain.handle("grade:get-all", () => gradeService.getAll());
  ipcMain.handle("grade:get-page", (_, params: GradePageParams) =>
    gradeService.getPage(params)
  );
  ipcMain.handle("grade:register", (_, params: RegisterGradeDto) =>
    gradeService.register(params)
  );
  ipcMain.handle("grade:update", (_, params: UpdateGradeDto) =>
    gradeService.update(params)
  );
};

export default gradeHandlers;
