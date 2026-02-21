import { GalleryVerticalEnd } from "lucide-react";

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
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg ">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-medium">CitiSense</span>
                <span className="truncate text-xs">Sentiment Analysis</span>
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
