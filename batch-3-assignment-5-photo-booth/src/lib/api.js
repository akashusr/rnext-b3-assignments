import axios from "axios";
import { useAuth } from "../stores/useAuth";

const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL + "/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const accessToken = useAuth.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Get auth state and updater from the store
      const { refreshToken, setToken } = useAuth.getState();

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/refresh-token`,
        { refreshToken }
      );
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      console.log(`New Token: ${accessToken}`);
      setToken({ accessToken, refreshToken: newRefreshToken });

      // Retry the original request with the new token
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return axios(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default api;
