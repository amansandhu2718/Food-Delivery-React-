import axios from "axios";
import { getAccessToken, setAccessToken } from "./authService";

const BASE_URL = "http://localhost:5001";

const api = axios.create({
  baseURL: BASE_URL + "/",
  withCredentials: true,
});

// Attach Authorization header if access token is present
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  console.log("Attaching token to request:", token);
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// Response interceptor to handle 401 -> try refresh once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Use raw axios here to avoid hitting the same interceptors
        const resp = await axios.post(
          BASE_URL + "/api/auth/refresh",
          {},
          { withCredentials: true }
        );
        const newToken = resp.data?.accessToken;
        if (newToken) {
          setAccessToken(newToken);
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return api(originalRequest);
        }
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
