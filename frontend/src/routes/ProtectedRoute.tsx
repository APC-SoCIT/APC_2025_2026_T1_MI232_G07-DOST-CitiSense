import { Navigate, Outlet } from "react-router-dom";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    //post the refresh token to the refresh token endpoint, if response status is 200, then isAuthorized = true
    try {
      const res = await api.post("/api/auth/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log("this is the ", error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    // if no token setAuthorize to false
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    try {
      //post the token to verify endpoint, if it returns status 401, then trigger the refresh token function
      const response = await api.post("/api/auth/token/verify/", {
        token,
      });
      if (response.status === 200) {
        setIsAuthorized(true);
      }
    } catch (error) {
      if (error.response.status === 401) {
        await refreshToken();
      } else {
        setIsAuthorized(false);
      }
      console.log("this is the ", error);
    }
  };
  if (isAuthorized === null) {
    return <div>Loading... </div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
