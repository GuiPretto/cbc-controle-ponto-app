import { ServiceResponse } from "electron/electron-env";
import BaseApiService from "./BaseApiService";
import { AxiosResponse } from "axios";

export interface Grade {
  id: number;
  horarioEntradaInicial: string;
  horarioSaidaInicial: string;
  horarioEntradaFinal: string;
  horarioSaidaFinal: string;
  bloqueioEntradaInicial: number;
  bloqueioSaidaInicial: number;
  bloqueioEntradaFinal: number;
  bloqueioSaidaFinal: number;
  seg: boolean;
  ter: boolean;
  qua: boolean;
  qui: boolean;
  sex: boolean;
  sab: boolean;
  dom: boolean;
}

class GradeService extends BaseApiService {
  constructor() {
    super();
  }

  async getAll(): Promise<ServiceResponse<Grade[]>> {
    try {
      const response: AxiosResponse<Grade[]> = await this.client.get(
        "v1/grade"
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<Grade[]>;
    }
  }
}

export default GradeService;
