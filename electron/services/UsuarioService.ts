import { ServiceResponse } from "electron/electron-env";
import BaseApiService from "./BaseApiService";
import { AxiosResponse } from "axios";

export interface Usuario {
  id: number;
  nome: string;
  cpf: string;
  ativo: boolean;
  admin: boolean;
  dataCriacao: string;
  idGrade: number;
}

export interface RegisterUsuarioDto {
  nome: string;
  cpf: string;
  idGrade: number;
}

class UsuarioService extends BaseApiService {
  constructor() {
    super();
  }

  async register(
    nome: string,
    cpf: string,
    idGrade: number
  ): Promise<ServiceResponse<Usuario>> {
    try {
      const response: AxiosResponse<Usuario> = await this.client.post(
        "v1/usuario",
        {
          nome,
          cpf,
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
}

export default UsuarioService;
