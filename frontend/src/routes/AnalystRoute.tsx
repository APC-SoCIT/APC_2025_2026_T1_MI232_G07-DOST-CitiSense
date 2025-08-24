import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { UnauthorizedPage } from "../pages/Unauthorized";

const AnalystRoute = () => {
  const { user, isLoading } = useAuth(); //fetch the user value context
  const groups = user?.groups; //fetch the current logged in users' groups

  if (isLoading) {
    return <div className="text-center mt-10">Fetching role...</div>;
  }

  //check if the user has group analyst then render the data table if not just navigate to dashboard
  if (!groups?.includes("analyst")) {
    return <UnauthorizedPage />;
  }
  return groups?.includes("analyst") ? <Outlet /> : <UnauthorizedPage />;
};

export default AnalystRoute;
