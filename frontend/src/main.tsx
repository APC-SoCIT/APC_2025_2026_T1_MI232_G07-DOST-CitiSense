import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import NotFound from "./pages/NotFound.js";
import Layout from "./pages/Layout.js";
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
import EmailForgotPasswordSuccess from "./pages/EmailForgotPasswordSuccess.js";
import { EmailVerificationSent } from "./authentication/email-verification.js";
import EmailVerificationCallback from "./authentication/EmailVerificationCallback.js";

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
  { path: "/password/reset/confirm/:uid/:token", element: <ForgotPassword /> },
  { path: "/email/forgotpassword", element: <EmailForgotPassword /> },
  {
    path: "/email/forgotpassword/success",
    element: <EmailForgotPasswordSuccess />,
  },
  { path: "/email/verification", element: <EmailVerification /> },
  {
    path: "/email/verification/:key",
    element: <EmailVerificationCallback />,
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AuthenticationProvider>
      <RouterProvider router={router} />
    </AuthenticationProvider>
  </StrictMode>
);
