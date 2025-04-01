'use client';
import Whiteboard from "@/components/whiteboard/page"
import SidebarMenu from "@/components/menu/sidebarmenu"
import Header from "@/components/header/header";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import { useParams } from "next/navigation";

export default function CreateRoomPage() {
const { room_id } = useParams<{ room_id: string }>();
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
          { label: "Coding Room", link: "/dashboard/codingroom" },
          { label: "WhiteBoard", link: "/dashboard/codingroom/whiteboard" },
        ]}
       />
      <Whiteboard room_id={room_id}/>
 </div>
  )
}
