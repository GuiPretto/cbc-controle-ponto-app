import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SpringPage } from "electron/services/BaseApiService";
import {
  Grade,
  GradePageParams,
  RegisterGradeDto,
  UpdateGradeDto,
} from "electron/services/GradeService";

const GRADE_QUERY_KEY = "grade";
const GRADE_LIST_QUERY_KEY = "grade_list";
const GRADE_PAGE_QUERY_KEY = "grade_page";

export const useGetGrade = (idGrade?: number) => {
  return useQuery<Grade, Error>({
    queryKey: [GRADE_QUERY_KEY, idGrade],

    queryFn: async () => {
      if (!idGrade) {
        throw new Error("ID da grade ausente.");
      }
      const result = await window.api.grade.get(idGrade);

      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },

    placeholderData: (previousData) => previousData,
    enabled: !!idGrade,

    staleTime: Infinity,
  });
};

export const useGrades = () => {
  return useQuery<Grade[], Error>({
    queryKey: [GRADE_LIST_QUERY_KEY],
    queryFn: async () => {
      const result = await window.api.grade.getAll();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
  });
};

export const useGetGradePage = (params: GradePageParams) => {
  return useQuery<SpringPage<Grade>, Error>({
    queryKey: [GRADE_PAGE_QUERY_KEY, params],

    queryFn: async () => {
      const result = await window.api.grade.getPage(params);

      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },

    placeholderData: (previousData) => previousData,

    staleTime: 1000 * 60 * 1,
  });
};

export const useRegisterGrade = () => {
  const queryClient = useQueryClient();

  return useMutation<Grade, Error, RegisterGradeDto>({
    mutationFn: async (params: RegisterGradeDto) => {
      const result = await window.api.grade.register(params);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GRADE_PAGE_QUERY_KEY] });
    },
  });
};

export const useUpdateGrade = () => {
  const queryClient = useQueryClient();

  return useMutation<Grade, Error, UpdateGradeDto>({
    mutationFn: async (params: UpdateGradeDto) => {
      if (!params.id) {
        throw new Error("ID de usuário ausente.");
      }
      const result = await window.api.grade.update(params);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    onSuccess: (grade) => {
      queryClient.invalidateQueries({
        queryKey: [GRADE_QUERY_KEY, grade.id],
      });
      queryClient.invalidateQueries({ queryKey: [GRADE_PAGE_QUERY_KEY] });
    },
  });
};
