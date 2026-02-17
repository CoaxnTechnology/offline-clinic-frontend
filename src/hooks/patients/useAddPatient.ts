import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPatientService } from "@/services/patient.service";

export const useAddPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPatientService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });
};
