import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("🌍 API Base URL:", import.meta.env.VITE_API_BASE_URL);

// 🔥 REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    //console.log("──────────── REQUEST START ────────────");
    //console.log("➡️ URL:", config.baseURL + config.url);
    //console.log("📦 Method:", config.method);
    //console.log("🔐 Token from localStorage:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log("✅ Authorization header attached");
    } else {
      //console.log("❌ No token found in localStorage");
    }

    //console.log("📤 Final Headers:", config.headers);
    //console.log("──────────── REQUEST END ────────────");

    return config;
  },
  (error) => {
    console.log("❌ REQUEST ERROR:", error);
    return Promise.reject(error);
  },
);

// 🔥 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    // console.log("✅ RESPONSE SUCCESS:", response.status);
    return response;
  },
  (error) => {
    //console.log("❌ RESPONSE ERROR STATUS:", error.response?.status);
    //console.log("❌ RESPONSE ERROR DATA:", error.response?.data);
    return Promise.reject(error);
  },
);

export default api;
