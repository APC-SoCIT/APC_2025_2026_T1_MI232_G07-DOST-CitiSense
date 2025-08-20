import { Navigate, useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Checking credentials");
    const checkAuthorization = async () => {
      try {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        const response = await api.post("/api/auth/token/verify/", {
          token: accessToken,
        });
        if (response.status === 200) {
          setIsAuthorized(true);
        }
      } catch (error) {
        navigate("/login");
        setIsAuthorized(false);
        console.log(error.response?.data);
      }
    };
    checkAuthorization();
  }, []);

  if (!isAuthorized) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;
