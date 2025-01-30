"use client";

import Header from "@/components/header/header";
import SidebarMenu from "@/components/menu/sidebarmenu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import Timer from "@/components/shared/timer";
import { UserPlus } from "lucide-react";
import { NotebookPen } from "lucide-react";
import { AlarmClock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CodingRoom() {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active=""
      />
      <div className="flex flex-col flex-1 min-h-screen w-full">
        <Header
          menuItemsTop={menuItemsTop}
          menuItemsBottom={menuItemsBottom}
          activeMenu="Projects"
          breadcrumbItems={[
            { label: "dashboard", link: "/dashboard" },
            { label: "Coding Room", link: "/dashboard/codingroom" },
          ]}
        />
        <div className="flex justify-end space-x-5 p-4 mr-6 ">
        <div>
            <Timer />
          </div>
          <Button>
            <UserPlus />
            Invite
          </Button>
          <Link href={"room/whiteboard"}>
            <Button>
              <NotebookPen />
              WhiteBoard
            </Button>
          </Link>
        </div>

        {/* Main Coding Section */}
        <main className="flex flex-1 flex-col items-center p-4 sm:px-6 sm:py-0">
          <div className="flex flex-1 w-full p-6 space-x-6">
            {/* Compiler Section */}
            <Card className="flex-1 p-4 h-full ml-6">
              <h2 className="text-lg font-semibold mb-2">Compiler</h2>
              <Textarea
                className="w-full h-full"
                placeholder="Write your code here..."
              />
            </Card>

            {/* Input & Output Section */}
            <div className="flex flex-col w-[350px] space-y-6">
              {/* Input Section */}
              <Card className="p-4 h-[50%]">
                <h2 className="text-lg font-semibold mb-2">Input</h2>
                <Textarea
                  className="w-full min-h-full"
                  placeholder="Enter input here..."
                />
              </Card>

              {/* Output Section */}
              <Card className="p-4 h-[50%]">
                <h2 className="text-lg font-semibold mb-2">Output</h2>
                <Textarea
                  className="w-full h-full"
                  readOnly
                  placeholder="Output will appear here..."
                />
              </Card>

              {/* Run Button */}
              <Button className="w-full">Run Code</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
