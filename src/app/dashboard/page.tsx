"use client";

import SidebarMenu from "@/components/menu/sidebarmenu";
import Header from "@/components/header/header";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active=""
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <Header
          menuItemsTop={menuItemsTop}
          menuItemsBottom={menuItemsBottom}
          activeMenu="Projects"
          breadcrumbItems={[{ label: "dashboard", link: "/dashboard" }]}
        />

        {/* Title & Subtitle for Activities */}
        <div className="mt-6 px-4 max-w-3xl ml-11">
          <h1 className="text-2xl font-bold">Your Activities</h1>
          <p className="text-gray-600 mt-1">
            View all your posts, likes, and interactions in one place.
          </p>
        </div>
      </div>
    </div>
  );
}




















// function x(){
  // for (var i=1; i<=5; i++){
  // setTimeOut(function(){
  // console.log(i);
  // }, 1000*i);
// }
// }
// x();
