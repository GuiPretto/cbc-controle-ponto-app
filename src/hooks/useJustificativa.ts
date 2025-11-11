import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Justificativa,
  RegisterJustificativaDto,
  UpdateJustificativaDto,
} from "electron/services/JustificativaService";

const JUSTIFICATIVA_QUERY_KEY = "justificativa";

export const useGetByUserAndDateJustificativa = (
  idUsuario?: number,
  data?: string
) => {
  return useQuery<Justificativa, Error>({
    queryKey: [JUSTIFICATIVA_QUERY_KEY, idUsuario],

    queryFn: async () => {
      if (!idUsuario || !data) {
        throw new Error("ID do usuário ou data ausente.");
      }
      const result = await window.api.justificativa.getByUserAndDate(
        idUsuario,
        data
      );
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },

    placeholderData: (previousData) => previousData,
    enabled: !!idUsuario && !!data,
    staleTime: 1000 * 60 * 1,
  });
};

export const useRegisterJustificativa = () => {
  return useMutation<Justificativa, Error, RegisterJustificativaDto>({
    mutationFn: async (params: RegisterJustificativaDto) => {
      const result = await window.api.justificativa.register(params);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};

export const useUpdateJustificativa = () => {
  const queryClient = useQueryClient();

  return useMutation<Justificativa, Error, UpdateJustificativaDto>({
    mutationFn: async (params: UpdateJustificativaDto) => {
      if (!params.id) {
        throw new Error("ID de justificativa ausente.");
      }
      const result = await window.api.justificativa.update(params);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (justificativa) => {
      queryClient.invalidateQueries({
        queryKey: [JUSTIFICATIVA_QUERY_KEY, justificativa.idUsuario],
      });
    },
  });
};

export const useDeleteJustificativa = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: number; idUsuario: number }>({
    mutationFn: async ({ id }: { id: number }) => {
      if (!id) throw new Error("ID de justificativa ausente.");

      const result = await window.api.justificativa.delete(id);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: (_, { idUsuario }) => {
      queryClient.removeQueries({
        queryKey: [JUSTIFICATIVA_QUERY_KEY, idUsuario],
      });
    },
  });
};
