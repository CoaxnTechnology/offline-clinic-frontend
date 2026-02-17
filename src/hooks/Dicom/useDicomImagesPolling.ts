import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getDicomImagesService } from "@/services/dicom.service";
import { updateAppointmentStatusService } from "@/services/appointment.service";

export const useDicomImagesPolling = (
  patientId: string,
  appointmentId: number,
  enabled: boolean
) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["dicom-images", patientId],
    queryFn: () => getDicomImagesService(patientId),

    enabled: enabled && !!patientId,

    refetchInterval: (query) => {
      const images = query.state.data?.data;

      if (!enabled) return false;
      if (images && images.length > 0) return false;

      return 5000; // poll every 5 sec
    },
  });

  // 🔥 Handle success manually (v5 way)
  useEffect(() => {
    if (query.data?.data?.length > 0) {
      const completeStudy = async () => {
        await updateAppointmentStatusService(
          appointmentId,
          "Study Completed"
        );

        queryClient.invalidateQueries({
          queryKey: ["with-doctor-appointments"],
        });
      };

      completeStudy();
    }
  }, [query.data, appointmentId, queryClient]);

  return query;
};
