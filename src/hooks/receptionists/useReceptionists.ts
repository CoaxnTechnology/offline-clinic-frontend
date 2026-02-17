import { useQuery } from "@tanstack/react-query";
import { getReceptionistsService } from "@/services/receptionist.service";

export const useReceptionists = (role = "receptionist") => {
  return useQuery({
    queryKey: ["receptionists", role],
    queryFn: () => getReceptionistsService(role),
    staleTime: 0,
  });
};
