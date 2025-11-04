import { ServiceResponse } from "electron/electron-env";
import BaseApiService, { SpringPage } from "./BaseApiService";
import { AxiosResponse } from "axios";

export interface Usuario {
  id: number;
  nome: string;
  cpf: string;
  ativo: boolean;
  admin: boolean;
  dataCriacao: string;
  email: string;
  master: boolean;
  idGrade: number;
}

export interface RegisterUsuarioDto {
  nome: string;
  cpf: string;
  email: string;
  idGrade: number;
}

export interface UpdateUsuarioDto extends RegisterUsuarioDto {
  id?: number;
}

export interface ChangePasswordUsuarioDto {
  id?: number;
  senha: string;
}

export interface UsuarioPageParams {
  page: number;
  size: number;
  sort?: string[];
  nome?: string;
  cpf?: string;
  ativo?: boolean;
  email?: string;
  idGrade?: number;
}

class UsuarioService extends BaseApiService {
  constructor() {
    super();
  }

  async get(idUsuario: number): Promise<ServiceResponse<Usuario>> {
    try {
      const response: AxiosResponse<Usuario> = await this.client.get(
        `v1/usuario/${idUsuario}`
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<Usuario>;
    }
  }

  async getPage(
    params: UsuarioPageParams
  ): Promise<ServiceResponse<SpringPage<Usuario>>> {
    try {
      const response: AxiosResponse<SpringPage<Usuario>> =
        await this.client.get("v1/usuario", {
          params: params,
          paramsSerializer: {
            indexes: null,
          },
        });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<SpringPage<Usuario>>;
    }
  }

  async deactivate(idUsuario: number): Promise<ServiceResponse<Usuario>> {
    try {
      const response: AxiosResponse<Usuario> = await this.client.patch(
        `v1/usuario/${idUsuario}/inativar`
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<Usuario>;
    }
  }

  async activate(idUsuario: number): Promise<ServiceResponse<Usuario>> {
    try {
      const response: AxiosResponse<Usuario> = await this.client.patch(
        `v1/usuario/${idUsuario}/ativar`
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<Usuario>;
    }
  }

  async register(
    nome: string,
    cpf: string,
    email: string,
    idGrade: number
  ): Promise<ServiceResponse<Usuario>> {
    try {
      const response: AxiosResponse<Usuario> = await this.client.post(
        "v1/usuario",
        {
          nome,
          cpf,
          email,
          idGrade,
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<Usuario>;
    }
  }

  async update(
    idUsuario: number,
    nome: string,
    cpf: string,
    email: string,
    idGrade: number
  ): Promise<ServiceResponse<Usuario>> {
    try {
      const response: AxiosResponse<Usuario> = await this.client.put(
        `v1/usuario/${idUsuario}`,
        {
          nome,
          cpf,
          email,
          idGrade,
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<Usuario>;
    }
  }

  async changePassword(
    idUsuario: number,
    senha: string
  ): Promise<ServiceResponse<Usuario>> {
    try {
      const response: AxiosResponse<Usuario> = await this.client.patch(
        `v1/usuario/${idUsuario}/alterar-senha`,
        {
          senha,
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<Usuario>;
    }
  }

  async resetPassword(idUsuario: number): Promise<ServiceResponse<Usuario>> {
    try {
      const response: AxiosResponse<Usuario> = await this.client.patch(
        `v1/usuario/${idUsuario}/resetar-senha`
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<Usuario>;
    }
  }

  async changeAdmin(idUsuario: number): Promise<ServiceResponse<Usuario>> {
    try {
      const response: AxiosResponse<Usuario> = await this.client.patch(
        `v1/usuario/${idUsuario}/alterar-admin`
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<Usuario>;
    }
  }
}

export default UsuarioService;
