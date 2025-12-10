import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";
import Layout from "./pages/Layout.jsx";
import DataTablePage from "./components/table/DataTablePage.js";
import AuthCallback from "./authentication/AuthCallback.js";
import Archive from "./components/dashboard/Archive.js";
import DashboardPage from "./components/dashboard/Dashboard.js";
import { AuthenticationProvider } from "./context/AuthenticationContext.js";
import AnalystRoute from "./routes/AnalystRoute.js";
import Logout from "./pages/Logout.js";
import Profile from "./pages/Profile.js";
import ForgotPassword from "./pages/ForgotPassword.js";
import EmailForgotPassword from "./pages/EmailForgotPassword.js";
import EmailVerification from "./pages/EmailVerification.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "/table",
        element: <AnalystRoute />,
        children: [
          {
            index: true,
            element: <DataTablePage />,
          },
        ],
      },
      {
        path: "/archive",
        element: <Archive />,
      },
      { path: "*", element: <NotFound /> },
      { path: "/home", element: <Profile /> },
    ],
  },

  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/logout", element: <Logout /> },
  { path: "/accounts/google/login/callback", element: <AuthCallback /> },
  { path: "/forgotpassword", element: <ForgotPassword /> },
  { path: "/email/forgotpassword", element: <EmailForgotPassword /> },
  { path: "email/verification", element: <EmailVerification /> },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AuthenticationProvider>
      <RouterProvider router={router} />
    </AuthenticationProvider>
  </StrictMode>
);
