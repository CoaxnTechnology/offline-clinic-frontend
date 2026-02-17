import { useQuery } from "@tanstack/react-query";
import { getPatientByIdService } from "@/services/patient.service";

export const usePatientById = (id: string) => {
  return useQuery({
    queryKey: ["patient", id],
    queryFn: () => getPatientByIdService(id),
    enabled: !!id, // only run if id exists
  });
};
