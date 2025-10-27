import { ServiceResponse } from "electron/electron-env";
import BaseApiService, { SpringPage } from "./BaseApiService";
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

export type RegisterGradeDto = Omit<Grade, "id">;

export interface UpdateGradeDto extends RegisterGradeDto {
  id?: number;
}

export interface GradePageParams {
  page: number;
  size: number;
  sort?: string[];
}

class GradeService extends BaseApiService {
  constructor() {
    super();
  }

  async get(idGrade: number): Promise<ServiceResponse<Grade>> {
    try {
      const response: AxiosResponse<Grade> = await this.client.get(
        `v1/grade/${idGrade}`
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<Grade>;
    }
  }

  async getAll(): Promise<ServiceResponse<Grade[]>> {
    try {
      const response: AxiosResponse<Grade[]> = await this.client.get(
        "v1/grade/todos"
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<Grade[]>;
    }
  }

  async getPage(
    params: GradePageParams
  ): Promise<ServiceResponse<SpringPage<Grade>>> {
    try {
      const response: AxiosResponse<SpringPage<Grade>> = await this.client.get(
        "v1/grade",
        {
          params: params,
          paramsSerializer: {
            indexes: null,
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<SpringPage<Grade>>;
    }
  }

  async register(params: RegisterGradeDto): Promise<ServiceResponse<Grade>> {
    try {
      const response: AxiosResponse<Grade> = await this.client.post(
        "v1/grade",
        params
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<Grade>;
    }
  }

  async update(params: UpdateGradeDto): Promise<ServiceResponse<Grade>> {
    try {
      const response: AxiosResponse<Grade> = await this.client.put(
        `v1/grade/${params.id}`,
        params
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      return this.handleApiError(error) as ServiceResponse<Grade>;
    }
  }
}

export default GradeService;
