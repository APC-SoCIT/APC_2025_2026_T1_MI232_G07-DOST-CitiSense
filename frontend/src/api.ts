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
    //get the config of the request
    const originalRequest = error.config;

    //if the error is a 401 (unauthorized) and we already haven't tried a refresh for the expired access token, then refresh the access token
    //the !originalRequest.sent will prevent infinite looping of attempting to refresh token with an expired refresh token
    if (error.response?.status === 401 && !originalRequest.sent) {
      originalRequest.sent = true;
      try {
        //attempt to refresh the token
        await api.post("/api/auth/token/refresh/");

        //retry the original request with new token
        return api(originalRequest);
      } catch (refreshError) {
        console.log("Token refresh failed, user needs to login again");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
