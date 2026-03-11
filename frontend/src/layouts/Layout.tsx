import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/sidebar/app-sidebar";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import { Toaster } from "sonner";

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSidebar />
        <main className="flex flex-col grow min-w-0 bg-white">
          <div className="flex md:hidden">
            <SidebarTrigger className="h-9 w-9 sm:h-10 sm:w-10" />
          </div>
          <ProtectedRoute>
            <Toaster richColors position="top-right" />
            <Outlet />
          </ProtectedRoute>
        </main>
      </div>
    </SidebarProvider>
  );
}
