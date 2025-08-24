import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const Logout = () => {
  const { Logout } = useAuth();
  useEffect(() => {
    Logout();
  }, []);
  return <Navigate to="/login" />;
};

export default Logout;
