import authHandlers from "./authHandlers";
import themeHandlers from "./themeHandlers";

const ipcHandlers = () => {
  authHandlers();
  themeHandlers();
};

export default ipcHandlers;
