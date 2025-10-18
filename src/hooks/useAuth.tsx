import { ServiceResponse } from "electron/electron-env";
import { UserInfo } from "electron/services/BaseApiService";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (cpf: string, password: string) => Promise<ServiceResponse<UserInfo>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkInitialAuth = async () => {
      if (!window.api || !window.api.auth) {
        console.error("API do Electron não disponível.");
        setIsLoading(false);
        return;
      }
      try {
        const result = await window.api.auth.checkToken();
        if (result.success) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erro ao checar token:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkInitialAuth();
  }, []);

  // 2. Função de Login (Chama o IPC)
  const login = useCallback(async (username: string, password: string) => {
    if (!window.api || !window.api.auth)
      return { success: false, error: "API indisponível." };

    const result = await window.api.auth.login(username, password);

    if (result.success) {
      setIsAuthenticated(true);
    }
    return result;
  }, []);

  // 3. Função de Logout (Chama o IPC)
  const logout = useCallback(async () => {
    if (window.api && window.api.auth) {
      await window.api.auth.logout();
    }
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      login,
      logout,
    }),
    [isAuthenticated, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
