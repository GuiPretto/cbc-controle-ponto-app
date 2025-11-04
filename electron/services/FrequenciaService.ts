import { ServiceResponse } from "electron/electron-env";
import BaseApiService from "./BaseApiService";
import { AxiosResponse } from "axios";

export interface RegistroFrequenciaMensal {
  idUsuario: number;
  nome: string;
  cpf: string;
  mesReferencia: string;
  faltasGeral: string;
  frequencias: Frequencia[];
}

export interface Frequencia {
  data: string;
  justificativa: string;
  entradaInicial: string;
  saidaInicial: string;
  entradaFinal: string;
  saidaFinal: string;
  faltas: string;
}

class FrequenciaService extends BaseApiService {
  constructor() {
    super();
  }

  async getByUserAndPeriod(
    idUsuario: number,
    mesAno: string
  ): Promise<ServiceResponse<RegistroFrequenciaMensal>> {
    try {
      const response: AxiosResponse<RegistroFrequenciaMensal> =
        await this.client.get(`v1/frequencia/${idUsuario}`, {
          params: {
            mesAno,
          },
        });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(
        error
      ) as ServiceResponse<RegistroFrequenciaMensal>;
    }
  }
  async generateReportRegisterFrequencyMonthly(
    idUsuario: number,
    mesAno: string
  ): Promise<ServiceResponse<ArrayBuffer>> {
    try {
      const response: AxiosResponse<ArrayBuffer> = await this.client.get(
        `v1/frequencia/${idUsuario}/relatorio`,
        {
          params: {
            mesAno,
          },
          responseType: "arraybuffer",
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<ArrayBuffer>;
    }
  }
}

export default FrequenciaService;
