import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  SidebarTriggerClose,
  SidebarTriggerOpen,
  useSidebar,
} from "../ui/sidebar";

import DOSTLogo from "../auth/DOST-IRAD";

export function SidebarTitle() {
  const { state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {state === "expanded" ? (
          <SidebarMenuButton
            asChild
            size="lg"
            className="hover:bg-transparent active:bg-transparent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center"
          >
            <div>
              <div className="mt-20 ">
              <DOSTLogo />
              </div>

              <SidebarTriggerClose className="p-2" />
            </div>
          </SidebarMenuButton>
        ) : (
          <div className="flex items-center justify-center">
            <SidebarTriggerOpen className="p-5" />
          </div>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}