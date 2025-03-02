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
import {
  ChevronDown,
  Link as Linking,
  // MonitorPlay,
  // MonitorStop,
} from "lucide-react";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import Timer from "@/components/shared/timer";
import { MessageCircle } from "lucide-react";
import { UserPlus } from "lucide-react";
import { NotebookPen } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
import { Editor } from "@monaco-editor/react"; // Import Monaco Edito r
import { editor } from "monaco-editor";
import { useParams } from "next/navigation";
import { initSocket } from "@/service/socket";
import { Socket } from "socket.io-client";
import { axiosInstance } from "@/lib/axiosinstance";
import { toast } from "@/components/ui/use-toast";
import { useSelector } from "react-redux";

export default function CodingRoom() {
  const user = useSelector((state: any) => state.user);
  const userId = user.uid;
  const { room_id } = useParams<{ room_id: string }>();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [queuedCodeChanges, setQueuedCodeChanges] = useState<
    string | undefined
  >(undefined); // Queue for code changes
  const languages = ["c", "cpp", "java", "python", "javascript", "go", "rust"];
  const socketRef = useRef<Socket | null>(null);
  const [users, setUsers] = useState<{ socketId: string; userName: string }[]>(
    []
  );
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const isLocalChange = useRef(false); // Flag to track local changes
  const codeRef = useRef<string | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  // const mediaStreamRef = useRef<MediaStream | null>(null);
  useEffect(() => {
    const init = async () => {
      if (socketRef.current) return; // Prevent multiple connections

      socketRef.current = await initSocket();

      // Emit 'join' event with logged-in user details
      socketRef.current.emit("join", { 
        room_id, 
        userName: user?.username || "Guest", // Default to "Guest" if no user is logged in
        userId: user?.uid || "unknown" // Default ID if unavailable
      });

      // Listen for new user joining
      socketRef.current.on("user_joined", ({ clients, userName, socketId }) => {
        setUsers(clients);

        if (!userName || userName === "Guest") {
          toast({
            variant: "default",
            title: "User Join Error",
            description: "Something went wrong. Please try again.",
          });
        }

        if (socketRef.current) {
          socketRef.current.emit("code_sync", {
            code: codeRef.current,
            socketId,
          });
        }
      });

      // Listen for code changes from other users
      socketRef.current.on("code_change", ({ newCode }) => {
        if (!isLocalChange.current) {
          if (editorRef.current) {
            editorRef.current.setValue(newCode);
          } else if (newCode !== undefined) {
            setQueuedCodeChanges(newCode);
          }
        }
      });

      // Handle user disconnection
      socketRef.current.on("disconnected", ({ socketId, userName }) => {
        toast({
          variant: "destructive",
          title: "User Disconnected",
          description: `User ${userName} left the room`,
        });

        setUsers((prev) => prev.filter((client) => client.socketId !== socketId));
      });

      // Handle socket errors
      socketRef.current.on("connect_error", (err) =>
        console.error("Socket error:", err)
      );
      socketRef.current.on("connect_failed", (err) =>
        console.error("Socket connection failed:", err)
      );
    };

    init();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [room_id, user]); // Dependency array updated to track user changes
  const sendInvite = async () => {
    const inviteLink = `${window.location.origin}/join-room/${room_id}`; // Create the invite link using room_id

    try {
      const response = await axiosInstance.post("/api/invite", {
        email: inviteEmail,
        room_id,
        inviteLink, // Include the link to the room
      });

      if (response.status === 200) {
        alert(`Invitation sent to: ${inviteEmail}`);
        setInviteOpen(false);
        setInviteEmail(""); // Reset email field after sending
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      alert("Failed to send invite. Please try again.");
    }
  };

  const handleEditorChange = (code: string | undefined) => {
    if (code !== undefined) {
      if (socketRef.current && isLocalChange.current) {
        socketRef.current.emit("code_change", {
          roomId: room_id,
          newCode: code,
        });
        codeRef.current = code;
      }
    }
  };

  const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor; // Store the editor instance in the ref

    // Apply any queued code changes
    if (queuedCodeChanges !== undefined) {
      editorRef.current.setValue(queuedCodeChanges);
      setQueuedCodeChanges(undefined); // Clear the queue
    }

    editor.onDidChangeModelContent(() => {
      isLocalChange.current = true; // Set flag to true when local change occurs
      setTimeout(() => {
        isLocalChange.current = false; // Reset flag after a short delay
      }, 100);
    });
  };

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
          <Link href={"whiteboard"}>
            <Button>
              <NotebookPen />
              WhiteBoard
            </Button>
          </Link>
          {/* {!isChatOpen && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <MessageCircle
                className="cursor-pointer p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                size={40}
                color="#00a550"
                onClick={() => setIsChatOpen(true)}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )} */}

     

   <Chat/>
    </div>
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
          <div>
          <h2>Users in Room: {users.length}/5</h2>
<ul>
  {users.map(({ socketId, userName}) => (
    <li key={socketId} className="flex items-center gap-2 p-2 border-b">
      <span className="font-bold">{userName || "Guest"}</span> 
    </li>
  ))}
</ul>

          </div>
          <div className="flex flex-1 w-full p-6 space-x-6">
            <Card className="flex-1 p-4 h-full ml-6">
              <h2 className="text-lg font-semibold mb-2">Compiler</h2>
              <Editor
                height="580px"
                width="100%"
                defaultLanguage={selectedLanguage}
                defaultValue="//start from here"
                theme="vs-dark"
                onChange={handleEditorChange}
                onMount={handleEditorMount}
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

              <Button
                className="w-full"
                onClick={() => console.log("Running code:", room_id)}
              >
                Run Code
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
