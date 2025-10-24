import { useQuery } from "@tanstack/react-query";
import { RegistroFrequenciaMensal } from "electron/services/FrequenciaService";

const FREQUENCIA_BY_USER_AND_PERIOD_QUERY_KEY = "frequencia_by_user_and_period";

export const useGetByUserAndPeriodFrequencia = ({
  idUsuario,
  mesAno,
}: {
  idUsuario?: number;
  mesAno?: string;
}) => {
  return useQuery<RegistroFrequenciaMensal, Error>({
    queryKey: [
      FREQUENCIA_BY_USER_AND_PERIOD_QUERY_KEY,
      `${idUsuario}_${mesAno}`,
    ],

    queryFn: async () => {
      if (!idUsuario) {
        throw new Error("ID do usuário ausente.");
      }
      if (!mesAno) {
        throw new Error("Período ausente.");
      }
      const result = await window.api.frequencia.getByUserAndPeriod(
        idUsuario,
        mesAno
      );

      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },

    placeholderData: (previousData) => previousData,
    enabled: !!idUsuario || !!mesAno,
    staleTime: (1000 * 60 * 1) / 4,
  });
};
