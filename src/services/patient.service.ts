// patient.service.ts
import api from "./api";

export const getPatientsService = async (page = 1, limit = 20) => {
  const response = await api.get("/patients", {
    params: { page, limit },
  });
  return response.data;
};

export const addPatientService = async (patientData: any) => {
  const response = await api.post("/patients", patientData);
  return response.data;
};

export const updatePatientService = async (
  patientId: string,
  patientData: any,
) => {
  console.log("🛠️ updatePatientService CALLED");
  console.log("➡️ URL:", `/patients/${patientId}`);
  console.log("📦 PAYLOAD SENT:", patientData);

  try {
    const response = await api.put(`/patients/${patientId}`, patientData);

    console.log("✅ UPDATE PATIENT RESPONSE:", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "❌ UPDATE PATIENT API ERROR",
      error?.response?.data || error,
    );
    throw error; // important so react-query onError works
  }
};

export const searchPatientsService = async (
  query: string,
  page = 1,
  limit = 20,
) => {
  const response = await api.get("/patients/search", {
    params: { q: query, page, limit },
  });
  return response.data;
};
export const getPatientByIdService = async (patientId: string) => {
  const response = await api.get(`/patients/${patientId}`);
  return response.data;
};

// services/patient.service.ts

export const getPatientHistoryService = async (patientId: string) => {
  console.log("🔥 Calling Patient History API");
  console.log("Patient ID:", patientId);

  const response = await api.get(`/patients/${patientId}/history`);

  console.log("✅ Full API Response:", response.data);

  return response.data;
};
export const deletePatientService = async (patientId: string) => {
  const response = await api.delete(`/patients/${patientId}`);
  return response.data;
};
