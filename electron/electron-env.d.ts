/// <reference types="vite-plugin-electron/electron-env" />

import {
  GradePageParams,
  RegisterGradeDto,
  UpdateGradeDto,
} from "./services/GradeService";
import { RegisterJustificativaDto } from "./services/JustificativaService";
import { UsuarioPageParams } from "./services/UsuarioService";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  idUser: number;
  username: string;
  role: string;
  requerTrocarSenha: boolean;
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
        get(idGrade: number);
        getAll();
        getPage(params: GradePageParams);
        register(params: RegisterGradeDto);
        update(params: UpdateGradeDto);
      };
      usuario: {
        get(idUsuario: number);
        getPage(params: UsuarioPageParams);
        deactivate(idUsuario: number);
        activate(idUsuario: number);
        update(
          idUsuario: number,
          nome: string,
          cpf: string,
          email: string,
          idGrade: number
        );
        register(nome: string, cpf: string, email: string, idGrade: number);
        changePassword(idUsuario: number, senha: string);
        resetPassword(idUsuario: number);
      };
      fingerprint: {
        start();
        stop();
        onData(cb: (data: unknown) => void);
        onError(cb: (err: unknown) => void);
        onStopped(cb: (info: unknown) => void);
      };
      batida: {
        register(template: string);
      };
      biometria: {
        register(idUsuario: number, template: string);
      };
      frequencia: {
        getByUserAndPeriod(idUsuario: number, mesAno: string);
        generateReportRegisterFrequencyMonthly(
          idUsuario: number,
          mesAno: string
        );
      };
      justificativa: {
        register(params: RegisterJustificativaDto);
      };
      download: {
        savePdf(data: ArrayBuffer, defaultName: string);
      };
    };
  }
}

interface CustomIpcRenderer {
  getSystemTheme: () => Promise<boolean>;
  onSystemThemeChange: (callback: (isDark: boolean) => void) => void;
}
