import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, //send cookies
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const authPath =
      window.location.href.includes("/login") ||
      window.location.href.includes("/register") ||
      window.location.href.includes("/email");

    // Get the config of the request
    const originalRequest = error.config;

    // If the error is a 401 (unauthorized) and we already haven't tried a refresh for the expired access token, then refresh the access token
    // The !originalRequest.sent will prevent infinite looping of attempting to refresh token with an expired refresh token
    // The authPath check is there to prevent any token refresh from happening from an authentication url.
    // Also checks if the user is logged in or not; default to false
    if (error.response?.status === 401 && !originalRequest.sent && !authPath) {
      originalRequest.sent = true;

      try {
        // Attempt to refresh the token
        await api.post("/api/auth/token/refresh/");

        // Retry the original request with new token
        return api(originalRequest);
      } catch (refreshError) {
        console.log("Token refresh failed, user needs to login again");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
