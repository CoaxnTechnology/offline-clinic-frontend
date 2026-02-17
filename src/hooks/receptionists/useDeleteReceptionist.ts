import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReceptionistService } from "@/services/receptionist.service";

export const useDeleteReceptionist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteReceptionistService(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["receptionists"],
      });
    },
  });
};
