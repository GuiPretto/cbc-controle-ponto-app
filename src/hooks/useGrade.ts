import { useQuery } from "@tanstack/react-query";
import { Grade } from "electron/services/GradeService";

const GRADE_QUERY_KEY = "grade";

export const useGrades = () => {
  return useQuery<Grade[], Error>({
    queryKey: [GRADE_QUERY_KEY],
    queryFn: async () => {
      const result = await window.api.grade.getAll();
      if (result.success) {
        return result.data;
      }
      throw new Error(result.error);
    },
  });
};

// Hook para criar dados
// export const useCreateGrade = () => {
//     const queryClient = useQueryClient();

//     // Função mutationFn chama seu serviço IPC para criar
//     return useMutation({
//         mutationFn: async (dto) => {
//             const result = await window.api.grade.create(dto);
//             if (!result.success) {
//                 throw new Error(result.error);
//             }
//             return result.data;
//         },
//         // Invalida o cache após o sucesso para forçar o refetch (automaticamente)
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: [GRADE_QUERY_KEY] });
//         },
//     });
// };
