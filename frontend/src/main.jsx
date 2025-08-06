import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";
import Home from "./pages/Home.jsx";
import DashboardPage1 from "./pages/Dashboard1";
import Layout from "./pages/Layout.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import DataTablePage from "./components/table/page.js";

const Logout = () => {
  localStorage.clear();
  return <Navigate to="/login" />;
};

const RegisterAndLogout = () => {
  localStorage.clear();
  return <Register />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DataTablePage />,
      },
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/archive",
        element: <NotFound />,
      },
    ],
  },

  { path: "/login", element: <Login /> },
  { path: "/register", element: <RegisterAndLogout /> },
  { path: "/logout", element: <Logout /> },
  { path: "*", element: <NotFound /> },
  { path: "/dashboard1", element: <DashboardPage1 /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
