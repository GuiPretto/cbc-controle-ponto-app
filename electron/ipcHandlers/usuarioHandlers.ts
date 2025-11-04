import { ipcMain } from "electron";
import UsuarioService, { UsuarioPageParams } from "../services/UsuarioService";

const usuarioService = new UsuarioService();

const usuarioHandlers = () => {
  ipcMain.handle("usuario:get", (_, idUsuario: number) =>
    usuarioService.get(idUsuario)
  );
  ipcMain.handle(
    "usuario:register",
    (_, nome: string, cpf: string, email: string, idGrade: number) =>
      usuarioService.register(nome, cpf, email, idGrade)
  );
  ipcMain.handle(
    "usuario:update",
    (
      _,
      idUsuario: number,
      nome: string,
      cpf: string,
      email: string,
      idGrade: number
    ) => usuarioService.update(idUsuario, nome, cpf, email, idGrade)
  );
  ipcMain.handle("usuario:deactivate", (_, idUsuario: number) =>
    usuarioService.deactivate(idUsuario)
  );
  ipcMain.handle("usuario:activate", (_, idUsuario: number) =>
    usuarioService.activate(idUsuario)
  );
  ipcMain.handle("usuario:get-page", (_, params: UsuarioPageParams) =>
    usuarioService.getPage(params)
  );
  ipcMain.handle(
    "usuario:change-password",
    (_, idUsuario: number, senha: string) =>
      usuarioService.changePassword(idUsuario, senha)
  );
  ipcMain.handle("usuario:reset-password", (_, idUsuario: number) =>
    usuarioService.resetPassword(idUsuario)
  );
  ipcMain.handle("usuario:change-admin", (_, idUsuario: number) =>
    usuarioService.changeAdmin(idUsuario)
  );
};

export default usuarioHandlers;
