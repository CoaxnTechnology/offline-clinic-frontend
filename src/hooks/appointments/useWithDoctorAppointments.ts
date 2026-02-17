import { useQuery } from "@tanstack/react-query";
import { getWithDoctorAppointmentsService } from "@/services/appointment.service";

export const useWithDoctorAppointments = () => {
  return useQuery({
    queryKey: ["with-doctor-appointments"],
    queryFn: getWithDoctorAppointmentsService,
    refetchInterval: 3000, // 🔥 auto refresh every 3 sec
  });
};
