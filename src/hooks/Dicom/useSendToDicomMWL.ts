import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendToDicomMWLService } from "@/services/dicom.service";

export const useSendToDicomMWL = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: number) => {
      console.log("📡 Sending to DICOM MWL...");
      console.log("➡️ Appointment ID:", appointmentId);

      const response = await sendToDicomMWLService(appointmentId);

      console.log("✅ DICOM MWL Success Response:", response);

      return response;
    },

    onSuccess: (data, variables) => {
      console.log("🎉 MWL Successfully Sent");
      console.log("Returned Data:", data);
      console.log("Appointment ID:", variables);

      // 🔥 refresh appointments automatically
      queryClient.invalidateQueries({
        queryKey: ["with-doctor-appointments"],
      });

      console.log("🔄 Appointments query invalidated");
    },

    onError: (error) => {
      console.error("❌ DICOM MWL Failed:", error);
    },
  });
};
