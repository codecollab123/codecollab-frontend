"use client";

import Header from "@/components/header/header";
import SidebarMenu from "@/components/menu/sidebarmenu";
import Chat from "@/components/shared/chat";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Link as Linking } from "lucide-react";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import Timer from "@/components/shared/timer";
import { MessageCircle } from "lucide-react";
import { UserPlus } from "lucide-react";
import { NotebookPen } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { TooltipContent } from "@/components/ui/tooltip";

export default function CodingRoom() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("C++");

  const languages = ["C", "C++", "Java", "Python", "JavaScript", "Go", "Rust"];
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

        <div className="flex justify-end space-x-5 p-4 mr-6">
          <div>
            <Timer />
          </div>
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus />
            Invite
          </Button>
          <Link href={"room/whiteboard"}>
            <Button>
              <NotebookPen />
              WhiteBoard
            </Button>
          </Link>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <MessageCircle
                  className="mt-1 cursor-pointer"
                  color={isChatOpen ? "#ff4500" : "#00a550"} // Change color when open
                  onClick={() => setIsChatOpen(!isChatOpen)}
                ></MessageCircle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {isChatOpen && <Chat />}
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Someone</DialogTitle>
            </DialogHeader>
            <Input
              type="email"
              placeholder="Enter email or name..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <div className="flex flex-1 gap-2">
              <Linking /> Private Link
            </div>
            <Button
              className="w-full"
              onClick={() => {
                alert(`Invitation sent to: ${inviteEmail}`);
                setInviteOpen(false);
                setInviteEmail("");
              }}
            >
              Send Invite
            </Button>
          </DialogContent>
        </Dialog>

        <main className="flex flex-1 flex-col items-center p-4 sm:px-6 sm:py-0">
          <div className="max-w-lg">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="w-full flex justify-between items-center ">
                  {selectedLanguage}
                  <ChevronDown className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className="cursor-pointer hover:bg-green-600 p-2"
                  >
                    {lang}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-1 w-full p-6 space-x-6">
            <Card className="flex-1 p-4 h-full ml-6">
              <h2 className="text-lg font-semibold mb-2">Compiler</h2>
              <Textarea
                className="w-full h-full"
                placeholder="Write your code here..."
              />
            </Card>
            <div className="flex flex-col w-[350px] space-y-6">
              <Card className="p-4 h-[50%]">
                <h2 className="text-lg font-semibold mb-2">Input</h2>
                <Textarea
                  className="w-full min-h-full"
                  placeholder="Enter input here..."
                />
              </Card>

              <Card className="p-4 h-[50%]">
                <h2 className="text-lg font-semibold mb-2">Output</h2>
                <Textarea
                  className="w-full h-full"
                  readOnly
                  placeholder="Output will appear here..."
                />
              </Card>

              <Button className="w-full">Run Code</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
