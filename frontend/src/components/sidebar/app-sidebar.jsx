import { Table, House, ChartColumnDecreasing } from "lucide-react";

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
      logo: House,
      plan: "Sentiment Analysis",
    },
  ],
  navMain: [
    {
      title: "Data Table",
      url: "/table",
      icon: Table,
    },
    {
      title: "Dashboard",
      url: "/",
      icon: ChartColumnDecreasing,
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
