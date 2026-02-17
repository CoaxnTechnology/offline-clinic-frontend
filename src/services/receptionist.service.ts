import api from "./api";

/* ===============================
   ✅ GET RECEPTIONISTS
================================= */
export const getReceptionistsService = async (role = "receptionist") => {
  const res = await api.get("/receptionists", {
    params: { role },
  });

  return res.data?.data || res.data || [];
};

/* ===============================
   ✅ ADD RECEPTIONIST
================================= */
export const addReceptionistService = async (data: {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
}) => {
  const res = await api.post("/receptionists", data);
  return res.data;
};

/* ===============================
   ✅ UPDATE RECEPTIONIST
================================= */
export const updateReceptionistService = async (
  id: number,
  data: Partial<{
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    role: string;
  }>,
) => {
  const res = await api.put(`/receptionists/${id}`, data);
  return res.data;
};

/* ===============================
   ✅ DELETE RECEPTIONIST
================================= */
export const deleteReceptionistService = async (id: number) => {
  const res = await api.delete(`/receptionists/${id}`);
  return res.data;
};
