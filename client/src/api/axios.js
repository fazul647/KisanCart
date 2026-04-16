import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ========================
// 🔹 REQUEST INTERCEPTOR
// ========================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("kisan_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ========================
// 🔹 RESPONSE INTERCEPTOR (🔥 AUTO LOGOUT)
// ========================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("🔒 Token expired or unauthorized");

      // ❌ Remove token
      localStorage.removeItem("kisan_token");

      // 🔄 Redirect to login page
      window.location.href = "/login"; // change if your route is different
    }

    return Promise.reject(error);
  }
);

export default API;