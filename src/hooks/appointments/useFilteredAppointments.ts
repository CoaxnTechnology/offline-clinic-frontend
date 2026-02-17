import { useQuery } from "@tanstack/react-query";
import { getFilteredAppointmentsService } from "@/services/appointment.service";

export const useFilteredAppointments = (
  dateFilter: "today" | "tomorrow" | "yesterday" | "all",
  status: string,
) => {
  return useQuery({
    queryKey: ["filtered-appointments", dateFilter, status],
    queryFn: () =>
      getFilteredAppointmentsService(dateFilter, status),
    staleTime: 0,
  });
};
