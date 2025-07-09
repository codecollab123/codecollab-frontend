"use-client";
import React from "react";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RootState } from "@/lib/store";

const DropdownProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2">
          <Avatar className="w-11 h-11">
            {user?.photoURL ? (
              <AvatarImage src={user.photoURL} alt="Profile" />
            ) : (
              <AvatarFallback>TR</AvatarFallback>
            )}
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <Link href={"/settings/personalInfo"}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <Link href={"/auth/login"}>Logout</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownProfile;
