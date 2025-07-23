import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { Outlet } from "react-router-dom"
import ProtectedRoute from "../components/ProtectedRoute"

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <ProtectedRoute>
            <Outlet />
        </ProtectedRoute>
      </main>
    </SidebarProvider>
  )
}