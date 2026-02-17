import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointmentStatusService } from "@/services/appointment.service";

export const useUpdateAppointmentStatus = (date?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: string;
    }) => updateAppointmentStatusService(id, status),

    // 🔥 Optimistic update
   
 onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["appointments", date],
      });
    },
  });
};