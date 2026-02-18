import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointmentStatusService } from "@/services/appointment.service";

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: string;
    }) => updateAppointmentStatusService(id, status),

    onSuccess: () => {
      // 🔥 refresh BOTH APIs
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["filteredAppointments"] });
    },
  });
};
