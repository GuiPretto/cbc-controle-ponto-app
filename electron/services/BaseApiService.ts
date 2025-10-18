import axios, { AxiosInstance, AxiosResponse } from "axios";
import { AuthResponse, ServiceResponse } from "electron/electron-env";
import keytar from "keytar";

export interface UserInfo {
  id: number;
  username: string;
  role: string;
  // Adicione mais campos do usuário aqui
}

// Resposta esperada do Spring Boot no login

const SERVICE_NAME = process.env.KEYTAR_SERVICE_NAME || "SERVICE_NAME";

// Variáveis de Estado (mantidas no escopo do módulo para acesso seguro)
let accessToken: string | null = null;
let currentIdUser: string | null = null;

class BaseApiService {
  protected client: AxiosInstance; // 'protected' permite que classes filhas acessem

  private readonly baseUrl: string;
  private readonly serviceName: string;

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || "http://localhost:8080";
    this.serviceName = process.env.KEYTAR_SERVICE_NAME || "CBC_App_Electron";
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });

    // Interceptor de Requisição (Injeta o Access Token)
    this.client.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor de Resposta (Lida com Erros e 401)
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;
        // Tratamento de 401 (Token Expirado)
        if (
          error.response &&
          error.response.status === 403 &&
          !originalRequest?._retry
        ) {
          // LÓGICA DE REFRESH TOKEN IRIA AQUI
          return Promise.reject({
            success: false,
            error: "Token Expirado ou Inválido",
            status: 403,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as ServiceResponse<any>);
        }

        // Mapeia a resposta de erro do Axios para o formato ServiceResponse
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorResponse: ServiceResponse<any> = {
          success: false,
          error: error.response?.data || error.message,
          status: error.response?.status,
        };
        return Promise.reject(errorResponse);
      }
    );
  }

  // --- Métodos de Infraestrutura (Autenticação) ---

  getIsAuthenticated(): boolean {
    return accessToken !== null;
  }

  async performLogin(
    username: string,
    password: string
  ): Promise<ServiceResponse<UserInfo>> {
    try {
      const response = await this.client.post<AuthResponse>(`/v1/auth/login`, {
        username,
        password,
      });

      const {
        accessToken: accessTokenResponse,
        refreshToken: refreshTokenResponse,
        idUser,
        username: usernameResponse,
        role,
      } = response.data;
      accessToken = accessTokenResponse;
      currentIdUser = idUser.toString();

      await keytar.setPassword(
        SERVICE_NAME,
        currentIdUser,
        refreshTokenResponse
      );

      return {
        success: true,
        data: {
          id: idUser,
          username: usernameResponse,
          role: role,
        },
      };
    } catch (error) {
      console.error(
        "[BaseAPI] Login Failed:",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).error || (error as Error).message
      );

      // Retorna um erro padronizado caso a requisição falhe antes mesmo do interceptor
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const status = (error as any).status || 0;
      const msg =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error as any).error ||
        (status === 401 ? "Credenciais Inválidas" : "Erro de Rede");

      return { success: false, error: msg, status: status };
    }
  }

  async performLogout(): Promise<ServiceResponse<null>> {
    if (!currentIdUser) {
      return { success: false, error: "Nenhum usuário logado para deslogar." };
    }

    await keytar.deletePassword(SERVICE_NAME, currentIdUser);

    accessToken = null;
    currentIdUser = null;

    return { success: true };
  }

  async checkStoredToken(): Promise<
    ServiceResponse<{ needsRefresh: boolean }>
  > {
    const storedRefreshToken = await keytar.getPassword(
      SERVICE_NAME,
      currentIdUser || "admin_default_slot"
    );
    if (storedRefreshToken) {
      return { success: true, data: { needsRefresh: true } };
    }
    return { success: false };
  }
}

export default BaseApiService;
