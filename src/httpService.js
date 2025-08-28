// import axis from "axios";

// export const httpService = axis.create({
//   baseURL: "http://localhost:3456/api",
//   withCredentials: true,
//   timeout: 10000,
// });

// httpService.defaults.headers.post["Content-Type"] = "application/json";

// httpService.interceptors.request.use(
//   (config) => {
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// httpService.interceptors.response.use(
//   (response) => {
//     // ✅ Success case: always wrap in a consistent object
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       // ✅ Server responded with an error
//       return Promise.resolve({
//         status: error.response.status,
//         data: error.response.data || error.message,
//       });
//     } else if (error.request) {
//       // ✅ Request made but no response
//       return Promise.resolve({
//         status: 0,
//         data: "No response from server. Please try again.",
//       });
//     } else {
//       // ✅ Something happened setting up request
//       return Promise.resolve({
//         status: 0,
//         data: error.message || "Unexpected error occurred",
//       });
//     }
//   }
// );

// export default httpService;

import axios from "axios";

const httpService = axios.create({
  baseURL: "http://localhost:3456/api",
  withCredentials: true, // ensures cookies (refresh token) are sent
  timeout: 10000,
});

// Store the current access token in memory (NOT localStorage)
let accessToken = null;

// Helper to set the token from login/refresh
export const setAccessToken = (token) => {
  accessToken = token;
};

// Attach access token to all requests
httpService.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle expired tokens
httpService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired (401) and this request hasn’t been retried yet
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Ask backend for a new access token using refresh cookie
        const res = await axios(
          "http://localhost:3456/api/refresh",

          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);

        // Retry original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return httpService(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export { httpService };
