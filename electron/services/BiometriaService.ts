import { ServiceResponse } from "electron/electron-env";
import BaseApiService from "./BaseApiService";
import { AxiosResponse } from "axios";
import { Usuario } from "./UsuarioService";

export interface Biometria {
  id: number;
  dados: Uint8Array;
  tipoDedo: TipoDedo;
  idUsuario: number;
}

export enum TipoDedo {
  POLEGAR_ESQUERDO,
  INDICADOR_ESQUERDO,
  MEDIO_ESQUERDO,
  ANELAR_ESQUERDO,
  MINIMO_ESQUERDO,

  POLEGAR_DIREITO,
  INDICADOR_DIREITO,
  MEDIO_DIREITO,
  ANELAR_DIREITO,
  MINIMO_DIREITO,
}

export interface RegisterBiometriaDto {
  idUsuario: number;
  template: string;
}

class BiometriaService extends BaseApiService {
  constructor() {
    super();
  }

  async register({
    idUsuario,
    template,
  }: RegisterBiometriaDto): Promise<ServiceResponse<Usuario>> {
    try {
      const response: AxiosResponse<Usuario> = await this.client.post(
        "v1/biometria",
        {
          idUsuario,
          template,
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

export default BiometriaService;
