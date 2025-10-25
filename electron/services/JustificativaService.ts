import { ServiceResponse } from "electron/electron-env";
import BaseApiService from "./BaseApiService";
import { AxiosResponse } from "axios";

export interface Justificativa {
  id: number;
  data: string;
  motivo: string;
  entradaInicial: boolean;
  saidaInicial: boolean;
  entradaFinal: boolean;
  saidaFinal: boolean;
  idUsuario: number;
}

export type RegisterJustificativaDto = Omit<Justificativa, "id">;

class JustificativaService extends BaseApiService {
  constructor() {
    super();
  }
  async register(
    params: RegisterJustificativaDto
  ): Promise<ServiceResponse<Justificativa>> {
    try {
      const response: AxiosResponse<Justificativa> = await this.client.post(
        "v1/justificativa",
        params
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<Justificativa>;
    }
  }
}

export default JustificativaService;
