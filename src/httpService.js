import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://fcsc.onrender.com/api"
    : "http://localhost:3456/api";

const httpService = axios.create({
  baseURL,
  withCredentials: true, // always send cookies
  timeout: 10000,
});

// No need to store or attach tokens manually anymore

httpService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired (401) and not retried yet
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Ask backend to refresh (this will update cookies if valid)
        await axios.get(`${baseURL}/refresh`, {
          withCredentials: true,
        });

        // retry original request
        return httpService(originalRequest);
      } catch (refreshError) {
        // If refresh also failed -> refresh token expired -> logout user
        if (refreshError.response && refreshError.response.status === 401) {
          // 🚨 Clear any client-side state (like user context, redux, etc.)
          // Then force logout
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { httpService };
