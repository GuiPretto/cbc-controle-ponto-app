import { ipcMain } from "electron";
import UsuarioService from "../services/UsuarioService";

const usuarioService = new UsuarioService();

const usuarioHandlers = () => {
  ipcMain.handle(
    "usuario:register",
    (_, nome: string, cpf: string, idGrade: number) =>
      usuarioService.register(nome, cpf, idGrade)
  );
};

export default usuarioHandlers;
