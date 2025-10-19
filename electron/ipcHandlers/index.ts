import authHandlers from "./authHandlers";
import gradeHandlers from "./gradeHandlers";
import themeHandlers from "./themeHandlers";
import usuarioHandlers from "./usuarioHandlers";

const ipcHandlers = () => {
  authHandlers();
  gradeHandlers();
  usuarioHandlers();
  themeHandlers();
};

export default ipcHandlers;
