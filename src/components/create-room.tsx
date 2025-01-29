"use client";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function CreateRoom({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const handleCreateRoom = () => {
    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("roomCode", roomCode); // Store in localStorage
    router.push("/codecreated");
  };
  
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen p-6", className)} {...props}>
      <Card className="shadow-lg max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Welcome Back</CardTitle>
          <CardDescription>Create or join a coding room!</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* Create Room Button */}
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleCreateRoom}>
            Create Room
          </Button>

          {/* Join Room Section */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full border border-gray-300">Join Room</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join a Room</DialogTitle>
                <DialogDescription>Enter the room ID below to join an existing room.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 mt-4">
                <Input type="text" placeholder="Enter Room ID" className="w-full p-2 border rounded-md" />
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Join</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
