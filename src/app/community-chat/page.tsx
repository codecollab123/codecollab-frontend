"use client";

import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { LoaderCircle, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

import Header from "@/components/header/header";
import SidebarMenu from "@/components/menu/sidebarmenu";
import { CardsChat } from "@/components/shared/CommunityChat";
import { subscribeToUserConversations } from "@/utils/common/firestoreUtils";
import { RootState } from "@/lib/store";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";

// Define the Conversation interface to match the expected shape
interface Conversation extends DocumentData {
  id: string;
  participants: string[];
  timestamp?: string;
  lastMessage?: any;
}

const HomePage = () => {
  const user = useSelector((state: RootState) => state.user);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation>(
    conversations[0],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchConversations = async () => {
      setLoading(true);
      unsubscribe = await subscribeToUserConversations(
        "conversations",
        user.uid,
        (data) => {
          setConversations(data as Conversation[]);
          setLoading(false);
        },
      );
    };

    fetchConversations();

    // Cleanup on component unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user.uid]);

  useEffect(() => {
    if (!activeConversation && conversations.length > 0) {
      setActiveConversation(conversations[0]);
    }
  }, [conversations, activeConversation]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Chats"
      />
      <div className="flex flex-col flex-1 min-h-screen w-full">
        <Header
          menuItemsTop={menuItemsTop}
          menuItemsBottom={menuItemsBottom}
          activeMenu="Projects"
          breadcrumbItems={[
            { label: "dashboard", link: "/dashboard" },
            { label: "Community", link: "community" },
          ]}
        />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-4 lg:grid-cols-3 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-3 flex justify-center items-center p-5">
              <LoaderCircle className="h-6 w-6 text-primary animate-spin" />
            </div>
          ) : conversations.length > 0 ? (
            <>
              <CardsChat
                conversation={activeConversation}
                conversations={conversations}
                setActiveConversation={setActiveConversation}
              />
            </>
          ) : (
            <div className="col-span-3 flex flex-col items-center justify-center h-full px-4 py-16 text-center text-muted-foreground">
              <MessageSquare className="w-10 h-10 mb-2" />
              <p className="text-lg font-medium">No conversations found</p>
              <p className="text-sm">
                Start a new chat or wait for others to connect!
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
