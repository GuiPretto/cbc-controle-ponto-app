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
    get: (idGrade: number) => ipcRenderer.invoke("grade:get", idGrade),
    getAll: () => ipcRenderer.invoke("grade:get-all"),
  },
  usuario: {
    get: (idUsuario: number) => ipcRenderer.invoke("usuario:get", idUsuario),
    getPage: (params: UsuarioPageParams) =>
      ipcRenderer.invoke("usuario:get-page", params),
    deactivate: (idUsuario: number) =>
      ipcRenderer.invoke("usuario:deactivate", idUsuario),
    activate: (idUsuario: number) =>
      ipcRenderer.invoke("usuario:activate", idUsuario),
    register: (nome: string, cpf: string, email: string, idGrade: number) =>
      ipcRenderer.invoke("usuario:register", nome, cpf, email, idGrade),
    update: (
      idUsuario: number,
      nome: string,
      cpf: string,
      email: string,
      idGrade: number
    ) =>
      ipcRenderer.invoke(
        "usuario:update",
        idUsuario,
        nome,
        cpf,
        email,
        idGrade
      ),
    changePassword: (idUsuario: number, senha: string) =>
      ipcRenderer.invoke("usuario:change-password", idUsuario, senha),
    resetPassword: (idUsuario: number) =>
      ipcRenderer.invoke("usuario:reset-password", idUsuario),
  },
  fingerprint: {
    start: () => ipcRenderer.invoke("fingerprint:start"),
    stop: () => ipcRenderer.invoke("fingerprint:stop"),
    onData: (cb: (data: unknown) => void) => {
      console.log("aqui1");
      ipcRenderer.on("fingerprint:data", (_e, data) => cb(data));
    },
    onError: (cb: (err: unknown) => void) => {
      console.log("aqui2");
      ipcRenderer.on("fingerprint:error", (_e, err) => cb(err));
    },
    onStopped: (cb: (info: unknown) => void) => {
      ipcRenderer.on("fingerprint:stopped", (_e, info) => cb(info));
    },
  },
  batida: {
    register: (template: string) =>
      ipcRenderer.invoke("batida:register", template),
  },
  biometria: {
    register: (idUsuario: number, template: string) =>
      ipcRenderer.invoke("biometria:register", idUsuario, template),
  },
  frequencia: {
    getByUserAndPeriod: (idUsuario: number, mesAno: string) =>
      ipcRenderer.invoke("frequencia:get-by-user-period", idUsuario, mesAno),
  },
});
