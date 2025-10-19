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

const API_URL = process.env.API_BASE_URL || "http://localhost:8080";
const SERVICE_NAME = process.env.KEYTAR_SERVICE_NAME || "SERVICE_NAME";

// Variáveis de Estado (mantidas no escopo do módulo para acesso seguro)
let accessToken: string | null = null;
let currentIdUser: string | null = null;
let isRefreshing = false;
let logoutTrigger: (() => void) | undefined;

// Função para injetar o mecanismo de envio IPC
export function setLogoutTrigger(trigger: () => void): void {
  logoutTrigger = trigger;
}

async function refreshAccessToken(client: AxiosInstance): Promise<boolean> {
  if (isRefreshing || !currentIdUser) {
    return false;
  }
  isRefreshing = true;

  try {
    const refreshToken = await keytar.getPassword(SERVICE_NAME, currentIdUser);

    if (!refreshToken) {
      isRefreshing = false;
      return false;
    }

    const response = await client.get<{ accessToken: string }>(
      `${API_URL}/v1/auth/refresh-token`,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    const { accessToken: newAccessToken } = response.data;

    accessToken = newAccessToken;
    isRefreshing = false;
    return true;
  } catch (error) {
    console.error("Falha no Refresh Token. Forçando Logout.", error);
    // Limpa tokens em caso de falha no refresh
    if (currentIdUser) {
      keytar.deletePassword(SERVICE_NAME, currentIdUser);
    }
    if (logoutTrigger) {
      logoutTrigger();
    }
    accessToken = null;
    currentIdUser = null;
    isRefreshing = false;
    return false;
  }
}

class BaseApiService {
  protected client: AxiosInstance; // 'protected' permite que classes filhas acessem

  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || "http://localhost:8080";
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });

    // Interceptor de Requisição (Injeta o Access Token)
    this.client.interceptors.request.use(
      (config) => {
        if (accessToken && !config.url?.match("refresh-token")) {
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
        const status = error.response?.status;

        if (
          status &&
          (status === 401 || status === 403) &&
          !originalRequest?._retry
        ) {
          originalRequest._retry = true;
          const refreshed = await refreshAccessToken(this.client);

          if (refreshed) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(originalRequest);
          }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorResponse: ServiceResponse<any> = {
          success: false,
          error: error.response?.data || error.message,
          status: status,
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
    } catch (error: unknown) {
      const mappedError = this.handleApiError(error);

      return {
        success: mappedError.success,
        error: mappedError.error,
        status: mappedError.status,
      } as ServiceResponse<UserInfo>;
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

  protected handleApiError(error: unknown): ServiceResponse<unknown> {
    // Verifica se o erro é uma ServiceResponse padronizada (vindo do interceptor)
    if (typeof error === "object" && error !== null && "success" in error) {
      // Se for, apenas retorna (com ServiceResponse<unknown>)
      return error as ServiceResponse<unknown>;
    }

    // Se for um erro do Axios (não padronizado)
    if (axios.isAxiosError(error)) {
      const errorData =
        (error.response?.data as { message?: string; error?: string }) || {};
      return {
        success: false,
        error: errorData.message || error.message,
        status: error.response?.status,
      };
    }

    // Erro desconhecido (devemos usar Type Guard para extrair a mensagem)
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Ocorreu um erro desconhecido na aplicação.";

    return {
      success: false,
      error: errorMessage,
      status: 500,
    };
  }
}

export default BaseApiService;
