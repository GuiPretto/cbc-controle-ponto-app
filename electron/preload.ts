import { ipcRenderer, contextBridge } from "electron";
import { UsuarioPageParams } from "./services/UsuarioService";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
});

contextBridge.exposeInMainWorld("api", {
  auth: {
    login: (username: string, password: string) =>
      ipcRenderer.invoke("auth:login", username, password),
    logout: () => ipcRenderer.invoke("auth:logout"),
    checkToken: () => ipcRenderer.invoke("auth:check-token"),
    onLogoutForced: (callback: () => void) => {
      ipcRenderer.on("auth:logout-forced", callback);
    },
  },
  grade: {
    getAll: () => ipcRenderer.invoke("grade:get-all"),
  },
  usuario: {
    getPage: (params: UsuarioPageParams) =>
      ipcRenderer.invoke("usuario:get-page", params),
    deactivate: (idUser: number) =>
      ipcRenderer.invoke("usuario:deactivate", idUser),
    activate: (idUser: number) =>
      ipcRenderer.invoke("usuario:activate", idUser),
    register: (nome: string, cpf: string, email: string, idGrade: number) =>
      ipcRenderer.invoke("usuario:register", nome, cpf, email, idGrade),
  },
});
