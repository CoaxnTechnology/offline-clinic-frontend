import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAppointmentService } from "@/services/appointment.service";

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointmentService,

    onSuccess: () => {
      // Refetch appointments list
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });
    },
  });
};
