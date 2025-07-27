import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSidebar />
        <main className="flex flex-col grow min-w-0 bg-white">
          <SidebarTrigger />
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        </main>
      </div>
    </SidebarProvider>
  );
}
