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
import About from "./pages/About";
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

const App = () => {
  const queryClient = new QueryClient();

  const ProtectedRoute = () => {
    const { isAuthenticated, requiresPasswordChange } = useAuth();
    const location = useLocation();
    console.log(isAuthenticated, requiresPasswordChange);

    // Se não estiver autenticado, redireciona para a página de login
    if (!isAuthenticated) {
      // Usa o 'state' para armazenar o caminho que o usuário tentou acessar
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiresPasswordChange && location.pathname !== "/trocar-senha") {
      // Redireciona para a tela de troca de senha
      return <Navigate to={"/trocar-senha"} replace />;
    }

    // Se estiver autenticado, renderiza as rotas filhas (que usam o Layout)
    return <Outlet />;
  };

  return (
    <>
      <AuthProvider>
        <CustomThemeProvider>
          <HashRouter>
            <SnackbarProvider>
              <QueryClientProvider client={queryClient}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/trocar-senha" element={<TrocarSenha />} />
                  <Route path="/captura" element={<Captura />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Layout />}>
                      {/* <Route index element={<Home />} /> */}
                      <Route path="visualizar-batidas" element={<About />} />
                      <Route
                        path="registrar-justificativa"
                        element={
                          <h2 className="p-8 text-2xl text-gray-800 dark:text-gray-200">
                            registrar-justificativa
                          </h2>
                        }
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
            </SnackbarProvider>
          </HashRouter>
        </CustomThemeProvider>
      </AuthProvider>
    </>
  );
};

export default App;
