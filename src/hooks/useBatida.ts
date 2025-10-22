import { useMutation } from "@tanstack/react-query";
import { Batida, RegisterBatidaDto } from "electron/services/BatidaService";

export const useRegisterBatida = () => {
  return useMutation<Batida, Error, RegisterBatidaDto>({
    mutationFn: async ({ template }: RegisterBatidaDto) => {
      const result = await window.api.batida.register(template);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};
