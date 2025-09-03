import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://accreditation.jamb.gov.ng/api"
    : "http://localhost:3456/api";

// process.env.NODE_ENV === "production"
//   ? "https://fcsc.onrender.com/api"
//   : "http://localhost:3456/api";

const httpService = axios.create({
  baseURL,
  withCredentials: true, // always send cookies
  timeout: 30_000,
});

// No need to store or attach tokens manually anymore
httpService.interceptors.request.use(
  (config) => {
    // you can add custom headers here if needed
    return config;
  },
  (error) => Promise.reject(error)
);
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

httpService.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Optionally handle 401 errors (unauthorized)
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return httpService(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await httpService("refresh"); // Backend should send new cookies here

        processQueue(null);
        return httpService(originalRequest);
      } catch (err) {
        processQueue(err, null);

        // 🚨 Both tokens expired — handle logout or redirect
        console.warn("Session expired. Logging out...");
        window.location.href = "/login";

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // return Promise.reject(error);
    if (error.response) {
      return { error: error.response.data, status: error.response.status };
    }
    return { error: "Network connection lost" };
  }
);

export { httpService };
