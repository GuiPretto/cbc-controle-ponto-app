import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SpringPage } from "electron/services/BaseApiService";
import {
  Usuario,
  RegisterUsuarioDto,
  UsuarioPageParams,
} from "electron/services/UsuarioService";

const USUARIO_QUERY_KEY = "usuario";
const USUARIO_PAGE_QUERY_KEY = "usuario";

export const useUsuarioPage = (params: UsuarioPageParams) => {
  return useQuery<SpringPage<Usuario>, Error>({
    queryKey: [USUARIO_PAGE_QUERY_KEY, params],

    queryFn: async () => {
      const result = await window.api.usuario.getPage(params);

      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },

    placeholderData: (previousData) => previousData,

    staleTime: 1000 * 60 * 1,
  });
};

export const useDeactivateUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation<Usuario, Error, number>({
    mutationFn: async (idUsuario: number) => {
      const result = await window.api.usuario.deactivate(idUsuario);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USUARIO_PAGE_QUERY_KEY] });
    },
  });
};

export const useActivateUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation<Usuario, Error, number>({
    mutationFn: async (idUsuario: number) => {
      const result = await window.api.usuario.activate(idUsuario);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USUARIO_PAGE_QUERY_KEY] });
    },
  });
};

export const useRegisterUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation<Usuario, Error, RegisterUsuarioDto>({
    mutationFn: async ({ nome, cpf, email, idGrade }: RegisterUsuarioDto) => {
      const result = await window.api.usuario.register(
        nome,
        cpf,
        email,
        idGrade
      );
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USUARIO_QUERY_KEY] });
    },
  });
};
