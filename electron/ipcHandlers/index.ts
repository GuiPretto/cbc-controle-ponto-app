import authHandlers from "./authHandlers";
import batidaHandlers from "./batidaHandlers";
import biometriaHandlers from "./biometriaHandlers";
import downloadHandlers from "./downloadHandlers";
import fingerprintHandlers from "./fingerprintHandlers";
import frequenciaHandlers from "./frequenciaHandlers";
import gradeHandlers from "./gradeHandlers";
import justificativaHandlers from "./justificativaHandlers";
import themeHandlers from "./themeHandlers";
import usuarioHandlers from "./usuarioHandlers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ipcHandlers = (mainWindow: any, setFingerprintProcess: any) => {
  authHandlers();
  gradeHandlers();
  usuarioHandlers();
  themeHandlers();
  batidaHandlers();
  biometriaHandlers();
  frequenciaHandlers();
  justificativaHandlers();
  downloadHandlers();
  fingerprintHandlers(mainWindow, setFingerprintProcess);
};

export default ipcHandlers;
