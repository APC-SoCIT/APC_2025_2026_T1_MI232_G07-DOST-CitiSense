import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    // if auth endpoint don't attach a token for login or register requests
    const authEndpoint =
      config.url?.includes("/api/auth/login/") ||
      config.url?.includes("/api/auth/register/");

    const token = localStorage.getItem(ACCESS_TOKEN);

    //if there is a token and is not accessing an auth endpoint, then attach the access token to the header
    if (token && !authEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    //get the config of the request
    const originalRequest = error.config;

    //to prevent from rerendering the login component after submitting invalid login credentials
    if (originalRequest.url.includes("/api/auth/token/")) {
      return Promise.reject(error);
    }

    //if the error is a 401 (unauthorized) and we already haven't tried a refresh for the expired access token, then refresh the access token
    //the !originalRequest.sent will prevent infinite looping of attempting to refresh token with an expired refresh token
    if (error.response.status === 401 && !originalRequest.sent) {
      originalRequest.sent = true;
      try {
        const refresh = localStorage.getItem(REFRESH_TOKEN);
        const response = await api.post("/api/auth/token/refresh/", {
          refresh,
        });
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        //retry original request with the new access token
        return api(originalRequest);
      } catch (error) {
        //if error then redirect user to login
        window.location.replace("/login");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
export default api;
