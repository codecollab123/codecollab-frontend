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
  Newspaper,
  Book,
} from "lucide-react";

import { MenuItem } from "@/components/menu/sidebarmenu";

export const menuItemsTop: MenuItem[] = [
  {
    href: "#",
    icon: <Boxes className="h-4 w-4 transition-all group-hover:scale-110" />,
    label: "Coding Collab",
  },
  {
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    label: "Dashboard",
  },
  {
    href: "/feeds",
    icon: (
      <Newspaper className="h-4 w-4 transition-all group-hover:scale-110" />
    ),
    label: "Feeds",
  },
  {
    href: "/createroom",
    icon: <Laptop className="h-5 w-5" />,
    label: "Coding Room",
  },
  {
    href: "/chat",
    icon: <MessageSquare className="h-5 w-5" />,
    label: "Chats",
  },
  {
    href: "/notes",
    icon: <StickyNote className="h-5 w-5" />,
    label: "Notes",
  },
  {
    href: "/studysolo",
    icon: <BookOpen className="h-5 w-5" />,
    label: "Study Solo",
  },

  {
    href: "/community-chat",
    icon: <Book className="h-5 w-5" />,
    label: "Community",
  },
];

export const menuItemsBottom: MenuItem[] = [
  {
    href: "/settings/personalInfo", //
    icon: <Settings className="h-5 w-5" />,
    label: "Settings",
  },
];

export const notesMenu: MenuItem[] = [
  {
    href: "#",
    icon: <Boxes className="h-4 w-4 transition-all group-hover:scale-110" />,
    label: "Coding Collab",
  },
  {
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    label: "Home",
  },
  {
    href: "/notes",
    icon: <StickyNote className="h-5 w-5" />,
    label: "Notes",
  },
  {
    href: "/notes/archive",
    icon: <Archive className="h-5 w-5" />,
    label: "Archive",
  },
  {
    href: "/notes/trash",
    icon: <Trash2 className="h-5 w-5" />,
    label: "Trash",
  },
];

export const dashboardMenu: MenuItem[] = [
  {
    href: "#",
    icon: <Boxes className="h-4 w-4 transition-all group-hover:scale-110" />,
    label: "Feed",
  },
  {
    href: "#",
    icon: <Boxes className="h-4 w-4 transition-all group-hover:scale-110" />,
    label: "Acitvity",
  },
  // {
  //   href: "#",
  //   icon: <Boxes className="h-4 w-4 transition-all group-hover:scale-110" />,
  //   label: "A",
  // },
];
