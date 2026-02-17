import { useQuery } from "@tanstack/react-query";
import { getAppointmentsService } from "@/services/appointment.service";

export const useAppointments = (date?: string) => {
  return useQuery({
    queryKey: ["appointments", date],
    queryFn: () => getAppointmentsService(date),
    staleTime: 0, // 🔥 VERY IMPORTANT
  });
};
