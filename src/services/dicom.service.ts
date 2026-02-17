import api from "./api";

/* ===============================
   📡 SEND TO DICOM MWL
================================= */
export const sendToDicomMWLService = async (appointmentId: number) => {
  try {
    console.log("📤 Calling SEND MWL API...");
    console.log("➡️ Appointment ID:", appointmentId);
    console.log(
      "🌍 URL:",
      `${
        import.meta.env.VITE_API_BASE_URL
      }/dicom/appointments/${appointmentId}/send-mwl`,
    );

    const response = await api.post(
      `/dicom/appointments/${appointmentId}/send-mwl`,
    );

    console.log("✅ SEND MWL Response:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("❌ SEND MWL Error Status:", error?.response?.status);
    console.error("❌ SEND MWL Error Data:", error?.response?.data);
    throw error;
  }
};

/* ===============================
   🖼 GET DICOM IMAGES
================================= */
export const getDicomImagesService = async (
  patientId: string,
  page = 1,
  limit = 50,
) => {
  try {
    console.log("📡 Fetching DICOM Images...");
    console.log("➡️ Patient ID:", patientId);
    console.log("📄 Page:", page, "Limit:", limit);
    const response = await api.get(`/dicom/appointments/${patientId}/images`, {
      params: {
        patient_id: patientId,
        page,
        limit,
      },
    });

    console.log("✅ DICOM Images Response:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("❌ DICOM Images Error Status:", error?.response?.status);
    console.error("❌ DICOM Images Error Data:", error?.response?.data);
    throw error;
  }
};
