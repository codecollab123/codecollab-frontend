import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function CreateRoom({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Create or join a room!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 w-full max-w-sm">
            <Button className="w-full">Create Room</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Join Room</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join a Room</DialogTitle>
                  <DialogDescription>
                    Please enter the room details to join.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 mt-4">
                  <input
                    type="text"
                    placeholder="Enter Room ID"
                    className="w-full p-2 border rounded-md"
                  />
                  <Button className="w-full">Join</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
