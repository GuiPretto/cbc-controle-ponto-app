"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld("api", {
  auth: {
    login: (username, password) => electron.ipcRenderer.invoke("auth:login", username, password),
    logout: () => electron.ipcRenderer.invoke("auth:logout"),
    checkToken: () => electron.ipcRenderer.invoke("auth:check-token"),
    onLogoutForced: (callback) => {
      electron.ipcRenderer.on("auth:logout-forced", callback);
    }
  },
  grade: {
    getAll: () => electron.ipcRenderer.invoke("grade:get-all")
  },
  usuario: {
    getPage: (params) => electron.ipcRenderer.invoke("usuario:get-page", params),
    deactivate: (idUser) => electron.ipcRenderer.invoke("usuario:deactivate", idUser),
    activate: (idUser) => electron.ipcRenderer.invoke("usuario:activate", idUser),
    register: (nome, cpf, email, idGrade) => electron.ipcRenderer.invoke("usuario:register", nome, cpf, email, idGrade)
  }
});
