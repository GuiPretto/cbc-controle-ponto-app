import { ipcMain } from "electron";
import GradeService from "../services/GradeService";

const gradeService = new GradeService();

const gradeHandlers = () => {
  ipcMain.handle("grade:get-all", () => gradeService.getAll());
};

export default gradeHandlers;
