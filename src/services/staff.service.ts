import api from "./api";

export const getStaffService = async () => {
  const response = await api.get("/staff");
  // Handle response structure - could be array or nested object
  const data = response.data;
  if (Array.isArray(data)) {
    return data;
  }
  if (data?.data && Array.isArray(data.data)) {
    return data.data;
  }
  if (data?.staff && Array.isArray(data.staff)) {
    return data.staff;
  }
  // Fallback to empty array if format is unexpected
  return [];
};

export const getDoctorsService = async () => {
  const response = await api.get("/doctors");
  // Handle response structure - could be array or nested object
  const data = response.data;
  if (Array.isArray(data)) {
    return data;
  }
  if (data?.data && Array.isArray(data.data)) {
    return data.data;
  }
  if (data?.doctors && Array.isArray(data.doctors)) {
    return data.doctors;
  }
  // Fallback to empty array if format is unexpected
  return [];
};

export const getAvailableSlotsService = async (
  doctorId: string,
  date: string,
) => {
  const response = await api.get("/appointments/available-slots", {
    params: {
      doctor_id: doctorId,
      date,
    },
  });
  return response.data || [];
};
