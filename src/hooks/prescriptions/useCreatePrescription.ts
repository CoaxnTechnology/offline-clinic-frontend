import { useMutation } from "@tanstack/react-query";
import { createPrescriptionService } from "@/services/prescription.service";

export const useCreatePrescription = () => {
  return useMutation({
    mutationFn: createPrescriptionService,
  });
};
