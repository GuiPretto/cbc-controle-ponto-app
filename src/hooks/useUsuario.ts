import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SpringPage } from "electron/services/BaseApiService";
import {
  Usuario,
  RegisterUsuarioDto,
  UsuarioPageParams,
  UpdateUsuarioDto,
  ChangePasswordUsuarioDto,
} from "electron/services/UsuarioService";
import { useAuth } from "./useAuth";

const USUARIO_QUERY_KEY = "usuario";
const USUARIO_CURRENT_QUERY_KEY = "usuario_current";
const USUARIO_PAGE_QUERY_KEY = "usuario_page";

export const useGetUsuario = (idUsuario?: number) => {
  return useQuery<Usuario, Error>({
    queryKey: [USUARIO_QUERY_KEY, idUsuario],

    queryFn: async () => {
      if (!idUsuario) {
        throw new Error("ID de usuário ausente.");
      }
      const result = await window.api.usuario.get(idUsuario);

      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },

    placeholderData: (previousData) => previousData,
    enabled: !!idUsuario,

    staleTime: 1000 * 60 * 1,
  });
};

export const useGetCurrentUsuario = (idUsuario?: number) => {
  return useQuery<Usuario, Error>({
    queryKey: [USUARIO_CURRENT_QUERY_KEY, idUsuario],

    queryFn: async () => {
      if (!idUsuario) {
        throw new Error("ID de usuário ausente.");
      }
      const result = await window.api.usuario.get(idUsuario);

      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },

    placeholderData: (previousData) => previousData,
    enabled: !!idUsuario,
  });
};

export const useGetUsuarioPage = (params: UsuarioPageParams) => {
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

export const useUpdateUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation<Usuario, Error, UpdateUsuarioDto>({
    mutationFn: async ({ id, nome, cpf, email, idGrade }: UpdateUsuarioDto) => {
      if (!id) {
        throw new Error("ID de usuário ausente.");
      }
      const result = await window.api.usuario.update(
        id,
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
    onSuccess: (usuario) => {
      queryClient.invalidateQueries({
        queryKey: [USUARIO_QUERY_KEY, usuario.id],
      });
      queryClient.invalidateQueries({ queryKey: [USUARIO_PAGE_QUERY_KEY] });
    },
  });
};

export const useChangePasswordUsuario = () => {
  const { senhaTrocada } = useAuth();
  return useMutation<Usuario, Error, ChangePasswordUsuarioDto>({
    mutationFn: async ({ id: idUsuario, senha }: ChangePasswordUsuarioDto) => {
      if (!idUsuario) {
        throw new Error("ID de usuário ausente.");
      }
      const result = await window.api.usuario.changePassword(idUsuario, senha);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      senhaTrocada();
    },
  });
};

export const useResetPasswordUsuario = () => {
  return useMutation<Usuario, Error, number | undefined>({
    mutationFn: async (idUsuario?: number) => {
      if (!idUsuario) {
        throw new Error("ID de usuário ausente.");
      }
      const result = await window.api.usuario.resetPassword(idUsuario);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};

export const useChangeAdminUsuario = () => {
  const queryClient = useQueryClient();

  return useMutation<Usuario, Error, number | undefined>({
    mutationFn: async (idUsuario?: number) => {
      if (!idUsuario) {
        throw new Error("ID de usuário ausente.");
      }
      const result = await window.api.usuario.changeAdmin(idUsuario);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (usuario) => {
      queryClient.invalidateQueries({
        queryKey: [USUARIO_QUERY_KEY, usuario.id],
      });
      queryClient.invalidateQueries({ queryKey: [USUARIO_PAGE_QUERY_KEY] });
    },
  });
};
