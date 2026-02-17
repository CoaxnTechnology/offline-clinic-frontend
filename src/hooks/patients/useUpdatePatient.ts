import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePatientService } from "@/services/patient.service";

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      console.log("🚀 UPDATE PATIENT CALLED");
      console.log("ID:", id);
      console.log("DATA SENT:", data);

      return updatePatientService(id, data);
    },

    onError: (error: any) => {
      console.error(
        "❌ UPDATE FAILED",
        error?.response?.data || error,
      );
    },

    onSuccess: (_, variables) => {
      console.log("✅ UPDATE SUCCESS");

      // single patient refresh
      queryClient.invalidateQueries({
        queryKey: ["patient", variables.id],
      });

      // patient list refresh
      queryClient.invalidateQueries({
        queryKey: ["patients"],
      });
    },
  });
};
