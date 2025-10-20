import { ipcMain } from "electron";
import UsuarioService, { UsuarioPageParams } from "../services/UsuarioService";

const usuarioService = new UsuarioService();

const usuarioHandlers = () => {
  ipcMain.handle(
    "usuario:register",
    (_, nome: string, cpf: string, email: string, idGrade: number) =>
      usuarioService.register(nome, cpf, email, idGrade)
  );
  ipcMain.handle("usuario:deactivate", (_, idUser: number) =>
    usuarioService.deactivate(idUser)
  );
  ipcMain.handle("usuario:activate", (_, idUser: number) =>
    usuarioService.activate(idUser)
  );
  ipcMain.handle("usuario:get-page", (_, params: UsuarioPageParams) =>
    usuarioService.getPage(params)
  );
};

export default usuarioHandlers;
