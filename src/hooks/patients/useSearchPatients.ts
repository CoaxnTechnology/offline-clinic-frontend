import { useQuery } from "@tanstack/react-query";
import { searchPatientsService } from "@/services/patient.service";

export const useSearchPatients = (search: string) => {
  return useQuery({
    queryKey: ["patients", search],
    queryFn: () => searchPatientsService(search),
    enabled: !!search, // only run if search exists
  });
};
