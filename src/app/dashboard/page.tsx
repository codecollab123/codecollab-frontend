"use client";
import SidebarMenu from "@/components/menu/sidebarmenu";
import Header from "@/components/header/header";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";

export default function Dashboard() {
  return (
    <div>
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active=""
      />
      <Header
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        activeMenu="Projects"
        breadcrumbItems={[
          { label: "dashboard", link: "/dashboard" },
        ]}
      />
    </div>
  );
}
