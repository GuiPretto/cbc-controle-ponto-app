import { ServiceResponse } from "electron/electron-env";
import BaseApiService from "./BaseApiService";
import { AxiosResponse } from "axios";

export interface Batida {
  id: number;
  dataHora: string;
  idUsuario: number;
}

export interface RegisterBatidaDto {
  template: string;
}

class BatidaService extends BaseApiService {
  constructor() {
    super();
  }

  async register(template: string): Promise<ServiceResponse<Batida>> {
    try {
      const response: AxiosResponse<Batida> = await this.client.post(
        "v1/batida",
        {
          template,
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<Batida>;
    }
  }
}

export default BatidaService;
