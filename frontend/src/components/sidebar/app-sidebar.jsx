import * as React from "react";
import { Bot, GalleryVerticalEnd, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { SidebarTitle } from "./sidebar-title";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  teams: [
    {
      name: "CitiSense",
      logo: GalleryVerticalEnd,
      plan: "Sentiment Analysis",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/table",
      icon: SquareTerminal,
    },
    {
      title: "Overview",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Dashboard",
          url: "/",
        },
        {
          title: "Archive",
          url: "/archive",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarTitle />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
