import { useMutation } from "@tanstack/react-query";
import { RegisterBatidaDto } from "electron/services/BatidaService";
import { Usuario } from "electron/services/UsuarioService";

export const useRegisterBatida = () => {
  return useMutation<Usuario, Error, RegisterBatidaDto>({
    mutationFn: async ({ template }: RegisterBatidaDto) => {
      const result = await window.api.batida.register(template);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};
