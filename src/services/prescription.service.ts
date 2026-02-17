import api from "./api";

export interface PrescriptionItem {
  medicine: string;
  dosage: string;
  duration_days: number;
  notes: string;
}

export interface CreatePrescriptionPayload {
  patient_id: string;
  items: PrescriptionItem[];
}

// ✅ CREATE PRESCRIPTION
export const createPrescriptionService = async (
  data: CreatePrescriptionPayload
) => {
  const response = await api.post("/prescriptions", data);
  return response.data;
};
