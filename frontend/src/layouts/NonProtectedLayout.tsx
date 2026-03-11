import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

const NonProtectedLayout = () => {
  return (
    <div>
      <Toaster richColors position="top-center" />
      <Outlet />
    </div>
  );
};

export default NonProtectedLayout;
