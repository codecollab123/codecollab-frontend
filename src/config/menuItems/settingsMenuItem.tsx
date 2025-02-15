import { MenuItem } from "@/components/menu/sidebarmenu";
import {
  Boxes,
  Home,
  Settings,
  BookOpen,
  Laptop,
  MessageSquare,
  Archive,
  StickyNote,
  Trash2,
} from "lucide-react";

export const menuItemsTop: MenuItem[] = [
  {
    href: "#",
    icon: <Boxes className="h-4 w-4 transition-all group-hover:scale-110" />,
    label: "Dehix",
  },
  {
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    label: "Dashboard",
  },
  {
    href: "/settings/personalInfo",
    icon: <Home className="h-5 w-5" />,
    label: "Dashboard",
  },
];
