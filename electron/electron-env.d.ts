/// <reference types="vite-plugin-electron/electron-env" />

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  idUser: number;
  username: string;
  role: string;
}

// Resposta padronizada para o Renderer
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

// Used in Renderer process, expose in `preload.ts`
declare global {
  interface Window {
    ipcRenderer: import("electron").IpcRenderer & CustomIpcRenderer;
    // electronAPI: {
    //   getSystemTheme: () => Promise<boolean>;
    //   onSystemThemeChange: (callback: (isDark: boolean) => void) => void;
    // };
    api: {
      auth: {
        login(
          username: string,
          password: string
        ): Promise<ServiceResponse<UserInfo>>;
        logout(): Promise<ServiceResponse<null>>;
        checkToken(): Promise<ServiceResponse<{ needsRefresh: boolean }>>;
        onLogoutForced(callback: () => void): void;
      };
      grade: {
        getAll();
      };
      usuario: {
        register(nome: string, cpf: string, idGrade: number);
      };
    };
  }
}

interface CustomIpcRenderer {
  getSystemTheme: () => Promise<boolean>;
  onSystemThemeChange: (callback: (isDark: boolean) => void) => void;
}
