import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addReceptionistService } from "@/services/receptionist.service";

export const useAddReceptionist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addReceptionistService,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["receptionists"],
      });
    },
  });
};
