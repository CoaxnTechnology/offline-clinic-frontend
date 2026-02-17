import { useQuery } from "@tanstack/react-query";
import { getPatientHistoryService } from "@/services/patient.service";

export const usePatientHistory = (patientId: string) => {
  console.log("🧠 Hook called with patientId:", patientId);

  return useQuery({
    queryKey: ["patient-history", patientId],
    queryFn: async () => {
      const data = await getPatientHistoryService(patientId);
      console.log("📦 Data inside hook:", data);
      return data?.data; // 🔥 VERY IMPORTANT
    },
    enabled: !!patientId, // only run if id exists
  });
};
