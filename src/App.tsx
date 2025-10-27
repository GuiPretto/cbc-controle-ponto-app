import {
  HashRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Layout from "./components/Layout";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import CustomThemeProvider from "./themes/CustomThemeProvider";
import ListarFuncionarios from "./pages/ListarFuncionarios";
import CadastrarFuncionario from "./pages/CadastrarFuncionario";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "./hooks/useSnackbar";
import DetalharFuncionario from "./pages/DetalharFuncionario";
import EditarFuncionario from "./pages/EditarFuncionario";
import TrocarSenha from "./pages/TrocarSenha";
import Captura from "./pages/Captura";
import VisualizarFrequencia from "./pages/VisualizarFrequencia";
import RegistrarJustificativa from "./pages/RegistrarJustificativa";
import ListarGrades from "./pages/ListarGrades";
import DetalharGrade from "./pages/DetalharGrade";
import CadastrarGrade from "./pages/CadastrarGrade";
import EditarGrade from "./pages/EditarGrade";

const App = () => {
  const queryClient = new QueryClient();

  const ProtectedRoute = () => {
    const { isAuthenticated, requiresPasswordChange } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiresPasswordChange && location.pathname !== "/trocar-senha") {
      return <Navigate to={"/trocar-senha"} replace />;
    }

    return <Outlet />;
  };

  return (
    <>
      <AuthProvider>
        <CustomThemeProvider>
          <HashRouter>
            <SnackbarProvider>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="pt-br"
              >
                <QueryClientProvider client={queryClient}>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/trocar-senha" element={<TrocarSenha />} />
                    <Route path="/captura" element={<Captura />} />
                    <Route element={<ProtectedRoute />}>
                      <Route path="/" element={<Layout />}>
                        <Route
                          path="visualizar-frequencia"
                          element={<VisualizarFrequencia />}
                        />
                        <Route
                          path="registrar-justificativa"
                          element={<RegistrarJustificativa />}
                        />
                        <Route
                          path="listar-funcionarios"
                          element={<ListarFuncionarios />}
                        />
                        <Route
                          path="listar-funcionarios/:id"
                          element={<DetalharFuncionario />}
                        />
                        <Route
                          path="listar-funcionarios/:id/editar"
                          element={<EditarFuncionario />}
                        />
                        <Route
                          path="cadastrar-funcionario"
                          element={<CadastrarFuncionario />}
                        />
                        <Route
                          path="listar-grades"
                          element={<ListarGrades />}
                        />
                        <Route
                          path="listar-grades/:id"
                          element={<DetalharGrade />}
                        />
                        <Route
                          path="listar-grades/:id/editar"
                          element={<EditarGrade />}
                        />
                        <Route
                          path="cadastrar-grade"
                          element={<CadastrarGrade />}
                        />
                      </Route>
                    </Route>

                    <Route
                      path="*"
                      element={
                        <div className="p-8 text-center bg-white dark:bg-gray-800 m-8 rounded-lg shadow-lg">
                          <h2 className="text-5xl font-bold text-red-600 mb-4">
                            404
                          </h2>
                          <p className="text-xl text-gray-700 dark:text-gray-300">
                            Página Não Encontrada
                          </p>
                          <Link
                            to="/login"
                            className="text-indigo-500 hover:text-indigo-700 mt-4 block"
                          >
                            Voltar para o Login
                          </Link>
                        </div>
                      }
                    />
                  </Routes>
                </QueryClientProvider>
              </LocalizationProvider>
            </SnackbarProvider>
          </HashRouter>
        </CustomThemeProvider>
      </AuthProvider>
    </>
  );
};

export default App;
