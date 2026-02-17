import api from "./api";
/* ===============================
   ✅ CREATE APPOINTMENT
================================= */
export const createAppointmentService = async (data: {
  patient_id: string;
  date: string;
  time: string;
}) => {
  const response = await api.post("/appointments", data);

  return response.data;
};
export const getAppointmentsService = async (date?: string) => {
  const response = await api.get("/appointments", {
    params: {
      date,
    },
  });

  // Handle response structure - could be array or nested object
  const data = response.data;
  if (Array.isArray(data)) {
    return data;
  }
  if (data?.data && Array.isArray(data.data)) {
    return data.data;
  }
  if (data?.appointments && Array.isArray(data.appointments)) {
    return data.appointments;
  }
  // Fallback to empty array if format is unexpected
  return [];
};

// ✅ Update Appointment Status
import axios from "axios";

export const updateAppointmentStatusService = async (
  id: number,
  status: string,
) => {
  console.log("🔥 STATUS UPDATE API CALLED");
  console.log("Sending:", { id, status });

  const token = localStorage.getItem("access_token");

  const response = await axios.put(
    `${import.meta.env.VITE_API_BASE_URL}/appointments/${id}/status`,
    { status },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  );

  console.log("✅ Response:", response.data);

  return response.data;
};
/* ==============================
   ✅ GET APPOINTMENTS WITH DOCTOR
================================= */
export const getWithDoctorAppointmentsService = async () => {
  const response = await api.get("/appointments/with-doctor");

  const data = response.data;

  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;

  return [];
};
export const getFilteredAppointmentsService = async (
  dateFilter: "today" | "tomorrow" | "yesterday" | "all",
  status: string,
) => {
  const response = await api.get("/appointments", {
    params: {
      date_filter: dateFilter,
      status,
    },
  });

  const data = response.data;

  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  if (data?.appointments && Array.isArray(data.appointments))
    return data.appointments;

  return [];
};
