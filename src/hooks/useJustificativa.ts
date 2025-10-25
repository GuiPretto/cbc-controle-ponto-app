import { useMutation } from "@tanstack/react-query";
import {
  Justificativa,
  RegisterJustificativaDto,
} from "electron/services/JustificativaService";

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
