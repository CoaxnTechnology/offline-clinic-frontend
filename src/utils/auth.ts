import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  clinic_id: number;
  role: string;
  exp: number;
}

export const getClinicIdFromToken = (): number | null => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  const decoded = jwtDecode<DecodedToken>(token);
  return decoded.clinic_id;
};
