import { useQuery } from "@tanstack/react-query";
import { getPatientsService } from "@/services/patient.service";

export const usePatients = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["patients", page, limit], // ✅ include ALL params
    queryFn: () => {
      console.log("🔥 PATIENT API CALLED");
      return getPatientsService(page, limit);
    },
    staleTime: 5 * 60 * 1000, // cache for 5 min
    refetchOnWindowFocus: false, // stop auto refetch
    refetchOnMount: false, // stop refetch on re-render
  });
};
