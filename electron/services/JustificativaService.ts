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

export interface UpdateJustificativaDto
  extends Omit<Justificativa, "data" | "idUsuario" | "id"> {
  id?: number;
}

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

  async getByUserAndDate(
    idUsuario: number,
    data: string
  ): Promise<ServiceResponse<Justificativa>> {
    try {
      const response: AxiosResponse<Justificativa> = await this.client.get(
        `v1/justificativa/por-usuario-data`,
        {
          params: {
            idUsuario,
            data,
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<Justificativa>;
    }
  }

  async update(
    params: UpdateJustificativaDto
  ): Promise<ServiceResponse<Justificativa>> {
    try {
      const response: AxiosResponse<Justificativa> = await this.client.put(
        `v1/justificativa/${params.id}`,
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

  async delete(idJustificativa: number): Promise<ServiceResponse<void>> {
    try {
      await this.client.delete(`v1/justificativa/${idJustificativa}`);

      return {
        success: true,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<void>;
    }
  }
}

export default JustificativaService;
