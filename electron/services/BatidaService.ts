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

const base64ToByteArray = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

class BatidaService extends BaseApiService {
  constructor() {
    super();
  }

  async register(template: string): Promise<ServiceResponse<Batida>> {
    try {
      const response: AxiosResponse<Batida> = await this.client.post(
        "v1/batida",
        {
          template: base64ToByteArray(template),
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
