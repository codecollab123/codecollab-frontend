"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react"; // Import Check icon

export function CreateCode({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false); // Track copy state

  useEffect(() => {
    setRoomCode(localStorage.getItem("roomCode") || "No Code Found");
  }, []);

  // Function to copy room code to clipboard and show checkmark
  const copyToClipboard = () => {
    if (roomCode && roomCode !== "No Code Found") {
      navigator.clipboard.writeText(roomCode);
      setCopied(true); // Show checkmark

      // Revert back to copy icon after 3 seconds
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen p-6", className)} {...props}>
      <Card className="shadow-lg max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Room Created</CardTitle>
          <CardDescription>Share this code with others to join.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* Display Room Code if Available */}
          {roomCode && roomCode !== "No Code Found" ? (
            <div className="flex items-center gap-2 border p-3 rounded-lg bg-gray-100">
              <Input className="text-center font-semibold text-lg" value={roomCode} readOnly />
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
          ) : (
            <p className="text-center text-red-500">{roomCode}</p>
          )}

          {/* Join Room Input */}
          <div className="grid gap-2">
            <Label htmlFor="join-room">Enter Room Code</Label>
            <Input id="join-room" type="text" placeholder="Enter code" />
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Join Room</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
