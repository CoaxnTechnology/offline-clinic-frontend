import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePatientService } from "@/services/patient.service";

export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patientId: string) =>
      deletePatientService(patientId),

    onSuccess: () => {
      // ✅ React Query v5 syntax
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });

      queryClient.invalidateQueries({
        queryKey: ["patient-history"],
      });
    },
  });
};
