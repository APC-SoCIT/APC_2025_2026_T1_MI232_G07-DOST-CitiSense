export type SidebarNavMainItemProps = {
  title: string;
  icon: React.ElementType;
  url?: string;
  items?: SidebarNavMainItemProps[];
};

export type NavMainProps = {
  items: SidebarNavMainItemProps[];
};
