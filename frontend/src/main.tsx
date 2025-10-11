import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DOSTCitiSenseLogin from "./Authentication/Login.tsx";
import MainDashboardLayout from "./pages/dashboard.tsx";
import App from "./App.tsx";

//https://reactrouter.com/6.30.1/routers/create-browser-router#createbrowserrouter
const router = createBrowserRouter([
  {
    path: "/",
    element: <DOSTCitiSenseLogin />,
  },
  {
    path: "/dashboard",
    element: <App />,
    children: [
      {
        path: "",
        element: <MainDashboardLayout />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
