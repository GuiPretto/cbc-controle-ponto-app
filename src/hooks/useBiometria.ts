import { useMutation } from "@tanstack/react-query";
import { RegisterBiometriaDto } from "electron/services/BiometriaService";
import { Usuario } from "electron/services/UsuarioService";

export const useRegisterBiometria = () => {
  return useMutation<Usuario, Error, RegisterBiometriaDto>({
    mutationFn: async ({ idUsuario, template }: RegisterBiometriaDto) => {
      const result = await window.api.biometria.register(idUsuario, template);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};
