import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./pages/AuthPage/Login.js";
import Register from "./pages/AuthPage/Register.js";
import NotFound from "./pages/NotFound.js";
import Layout from "./layouts/Layout.js";
import DataTablePage from "./pages/DataTable/DataTablePage.js";
import AuthCallback from "./components/auth/AuthenticationForms/AuthCallback.js";
import Archive from "./components/dashboard/Archive.js";
import DashboardPage from "./pages/Dashboard/Dashboard.js";
import { AuthenticationProvider } from "./context/AuthenticationContext.js";
import AnalystRoute from "./routes/AnalystRoute.js";
import Logout from "./pages/AuthPage/Logout.js";
import Profile from "./pages/ProfilePage/Profile.js";
import ForgotPassword from "./pages/AuthPage/ForgotPassword.js";
import EmailForgotPassword from "./pages/AuthPage/EmailForgotPassword.js";
import EmailVerification from "./pages/AuthPage/EmailVerification.js";
import EmailForgotPasswordSuccess from "./pages/AuthPage/EmailForgotPasswordSuccess.js";
import { EmailVerificationSent } from "./components/auth/AuthenticationForms/email-verification.js";
import EmailVerificationCallback from "./components/auth/AuthenticationForms/EmailVerificationCallback.js";
import GuestDashboard from "./pages/Dashboard/GuestDashboard.js";
import NonProtectedLayout from "./layouts/NonProtectedLayout.js";
import { AIRetrain } from "./pages/AIRetrain/AIRetrain.js";

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
        path: "/ai/retrain",
        element: <AIRetrain />,
      },
      { path: "*", element: <NotFound /> },
      { path: "/home", element: <Profile /> },
    ],
  },
  {
    path: "/guest-dashboard",
    element: <NonProtectedLayout />,
    children: [{ index: true, element: <GuestDashboard /> }],
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
  <AuthenticationProvider>
    <RouterProvider router={router} />
  </AuthenticationProvider>,
);
