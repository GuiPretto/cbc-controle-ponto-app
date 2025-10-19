import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Usuario, RegisterUsuarioDto } from "electron/services/UsuarioService";

const USUARIO_QUERY_KEY = "usuario";

export const useRegisterUsuario = () => {
  const queryClient = useQueryClient();

  // Função mutationFn chama seu serviço IPC para criar
  return useMutation<Usuario, Error, RegisterUsuarioDto>({
    mutationFn: async ({ nome, cpf, idGrade }: RegisterUsuarioDto) => {
      const result = await window.api.usuario.register(nome, cpf, idGrade);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    // Invalida o cache após o sucesso para forçar o refetch (automaticamente)
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USUARIO_QUERY_KEY] });
    },
  });
};
