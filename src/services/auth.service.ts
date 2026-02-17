import api from "./api";

export const loginService = async (data: {
  username: string;
  password: string;
}) => {
  console.log("📦 Calling loginService with:", data);

  try {
    const response = await api.post("/auth/login", data);
    console.log("🎯 Raw Axios Response:", response);
    return response.data;
  } catch (error) {
    console.log("🔥 loginService Error:", error);
    throw error;
  }
};
