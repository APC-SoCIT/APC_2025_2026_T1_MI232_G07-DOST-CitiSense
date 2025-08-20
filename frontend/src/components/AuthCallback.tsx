import React, { useEffect, useState } from "react";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        const response = await api.post("/api/auth/google/", { code });
        console.log("This is the code", { code });
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
        navigate("/");
      } catch (error) {
        console.log(error.response?.data);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    authenticate();
  }, [navigate]);

  if (isLoading) {
    return <div>loading...</div>;
  }

  return null;
};

export default AuthCallback;
