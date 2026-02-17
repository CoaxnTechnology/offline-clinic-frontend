import { useQuery } from "@tanstack/react-query";
import { getAvailableSlotsService } from "@/services/staff.service";

export const useAvailableSlots = (doctorId: string, date: string) => {
  return useQuery({
    queryKey: ["available-slots", doctorId, date],
    queryFn: () => getAvailableSlotsService(doctorId, date),
    enabled: !!doctorId && !!date,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
