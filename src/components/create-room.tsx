"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Initialize WebSocket connection
const socket: Socket = io("http://localhost:5000", {
  transports: ["websocket"],
  withCredentials: true,
});

export function CreateRoom({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [roomID, setRoomID] = useState("");  
  const [userName, setUserName] = useState("");
  const [showRoomID, setShowRoomID] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    socket.on("connect", () => console.log("Connected to WebSocket server", socket.id));
    socket.on("user_joined", ({ clients }) => console.log("User Joined:", clients));

    return () => {
      socket.off("user_joined");
    };
  }, []);

  // Create a Room ID but do not enter automatically
  const handleCreateRoom = () => {
    const newRoomID = uuidv4();
    setRoomID(newRoomID);
    setShowRoomID(true);
    localStorage.setItem("roomID", newRoomID);

    // Host joins the room but does not redirect
    socket.emit("join", { room_id: newRoomID, userName: "host" });
  };

  // Explicitly enter room on button click
  const handleEnterRoom = () => {
    if (!roomID) return alert("No Room ID available.");
    router.push(`/room/${roomID}`);
  };

  // Join a Room using a user-entered ID
  const handleJoinRoom = () => {
    if (!roomID || !userName) return alert("Please enter a Room ID and Username.");

    socket.emit("join", { room_id: roomID, userName });
    router.push(`/room/${roomID}`);
  };

  // Copy Room ID to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen p-6", className)} {...props}>
      <Card className="shadow-lg max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Welcome to the Coding Room</CardTitle>
          <CardDescription>Create or join a room to start coding!</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {!showRoomID ? (
            <Button className="w-full" onClick={handleCreateRoom}>
              Create Room
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-lg font-medium">Room ID:</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-xl font-bold text-green-600">{roomID}</p>
                <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                  {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
              <Button className="w-full mt-4" onClick={handleEnterRoom}>
                Enter Room
              </Button>
            </div>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full border border-gray-300">Join Room</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join a Room</DialogTitle>
                <DialogDescription>Enter the Room ID and your name to join.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 mt-4">
                <Input
                  type="text"
                  placeholder="Enter Room ID"
                  value={roomID}
                  onChange={(e) => setRoomID(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Enter Your Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleJoinRoom}>
                  Join Room
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
