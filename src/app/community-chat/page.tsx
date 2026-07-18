"use client";

import { useEffect, useState } from "react";
import { DocumentData, doc, getDoc, setDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { LoaderCircle, MessageSquare, Search, Globe, Users, Check, LogOut } from "lucide-react";
import { useSelector } from "react-redux";

import Header from "@/components/header/header";
import SidebarMenu from "@/components/menu/sidebarmenu";
import { CardsChat } from "@/components/shared/CommunityChat";
import { ChatList } from "@/components/shared/CommunityChatList";
import { subscribeToUserConversations, joinCommunity, leaveCommunity } from "@/utils/common/firestoreUtils";
import { db } from "@/config/firebaseConfig";
import { RootState } from "@/lib/store";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

const DEFAULT_COMMUNITIES = [
  {
    id: "global-code-collab",
    name: "Global Code Collab",
    description: "The official global community for all users of Code Collab. Ask questions, share your projects, and collaborate in real-time!",
    isCommunity: true,
    avatarUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=global-code-collab",
    participants: [],
    createdBy: "system",
  },
  {
    id: "web-development",
    name: "Web Development",
    description: "A community dedicated to frontend & backend web technologies. Discuss React, Next.js, Fastify, Node, databases, and more.",
    isCommunity: true,
    avatarUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=web-dev",
    participants: [],
    createdBy: "system",
  },
  {
    id: "ai-ml-developers",
    name: "AI & Machine Learning",
    description: "Connect with developers building AI/ML solutions. Share tips on Python, TensorFlow, PyTorch, LLMs, and Google Gemini APIs.",
    isCommunity: true,
    avatarUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=ai-ml",
    participants: [],
    createdBy: "system",
  },
  {
    id: "dsa-interview-prep",
    name: "DSA & Interview Prep",
    description: "Practice Data Structures & Algorithms, discuss LeetCode problems, share mock interview schedules, and prepare for tech careers.",
    isCommunity: true,
    avatarUrl: "https://api.dicebear.com/7.x/identicon/svg?seed=dsa-prep",
    participants: [],
    createdBy: "system",
  }
];

interface Conversation extends DocumentData {
  id: string;
  participants: string[];
  name?: string;
  timestamp?: string;
  lastMessage?: any;
  isCommunity?: boolean;
  avatarUrl?: string;
  description?: string;
}

const HomePage = () => {
  const user = useSelector((state: RootState) => state.user);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [allCommunities, setAllCommunities] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [joiningId, setJoiningId] = useState<string | null>(null);

  // 1. Initialize default communities if they don't exist in Firestore
  useEffect(() => {
    const initDefaultCommunities = async () => {
      for (const comm of DEFAULT_COMMUNITIES) {
        try {
          const docRef = doc(db, "conversations", comm.id);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            const timestamp = new Date().toISOString();
            await setDoc(docRef, {
              ...comm,
              timestamp,
              lastMessage: {
                content: `Welcome to the ${comm.name} Community!`,
                senderId: "system",
                senderName: "System",
                timestamp,
              }
            });
            console.log(`Created default community: ${comm.name}`);
          }
        } catch (error) {
          console.error("Error initializing default community:", error);
        }
      }
    };
    initDefaultCommunities();
  }, []);

  // 2. Real-time subscription to the user's joined conversations (including communities)
  useEffect(() => {
    if (!user.uid) return;
    setLoading(true);
    const unsubscribe = subscribeToUserConversations(
      "conversations",
      user.uid,
      (data) => {
        setConversations(data as Conversation[]);
        setLoading(false);
      },
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user.uid]);

  // 3. Real-time subscription to all available communities for exploration
  useEffect(() => {
    const q = query(
      collection(db, "conversations"),
      where("isCommunity", "==", true)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Conversation[];
      setAllCommunities(data);
    });

    return () => unsubscribe();
  }, []);

  // Set the first conversation as active if none is selected (only on desktop/large screens)
  useEffect(() => {
    if (conversations.length > 0 && !activeConversation && typeof window !== "undefined" && window.innerWidth >= 1024) {
      setActiveConversation(conversations[0]);
    }
  }, [conversations, activeConversation]);

  // Handle joining a community
  const handleJoin = async (communityId: string) => {
    if (!user.uid) return;
    try {
      setJoiningId(communityId);
      await joinCommunity(communityId, user.uid);
      
      // Auto open the chat of the community we just joined
      const communityDoc = allCommunities.find(c => c.id === communityId);
      if (communityDoc) {
        setActiveConversation({
          ...communityDoc,
          participants: [...(communityDoc.participants || []), user.uid]
        });
      }

      toast({
        title: "Community Joined",
        description: "You have successfully joined the community chat!",
      });
    } catch (error) {
      console.error("Error joining:", error);
      toast({
        variant: "destructive",
        title: "Join Failed",
        description: "Failed to join community. Please try again.",
      });
    } finally {
      setJoiningId(null);
    }
  };

  // Handle leaving a community
  const handleLeave = async (e: React.MouseEvent, communityId: string) => {
    e.stopPropagation(); // Avoid triggering any card clicks
    if (!user.uid) return;
    try {
      await leaveCommunity(communityId, user.uid);
      
      if (activeConversation?.id === communityId) {
        setActiveConversation(null);
      }

      toast({
        title: "Left Community",
        description: "You have successfully left the community.",
      });
    } catch (error) {
      console.error("Error leaving:", error);
      toast({
        variant: "destructive",
        title: "Leave Failed",
        description: "Failed to leave community. Please try again.",
      });
    }
  };

  // Filter communities based on search query
  const filteredCommunities = allCommunities.filter((comm) =>
    comm.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comm.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Community"
      />
      <div className="flex flex-col flex-1 min-h-screen w-full overflow-hidden">
        <Header
          menuItemsTop={menuItemsTop}
          menuItemsBottom={menuItemsBottom}
          activeMenu="Community"
          breadcrumbItems={[
            { label: "Dashboard", link: "/dashboard" },
            { label: "Community", link: "/community-chat" },
          ]}
        />
        
        <main className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
          
          {/* Left Column: Direct Chats list, Joined groups, & Community Explorer */}
          <div className={`w-full lg:w-[350px] flex-shrink-0 flex flex-col h-[calc(100vh-140px)] ${activeConversation ? "hidden lg:flex" : "flex"}`}>
            <Tabs defaultValue="joined" className="flex-1 flex flex-col">
              <TabsList className="grid grid-cols-2 mb-4 bg-muted/60 p-1 rounded-xl">
                <TabsTrigger value="joined" className="rounded-lg text-sm font-medium py-2">
                  My Chats
                </TabsTrigger>
                <TabsTrigger value="explore" className="rounded-lg text-sm font-medium py-2">
                  Explore
                </TabsTrigger>
              </TabsList>

              {/* Joined Chats Tab */}
              <TabsContent value="joined" className="flex-1 overflow-hidden mt-0 flex flex-col">
                {loading ? (
                  <div className="flex-1 flex justify-center items-center">
                    <LoaderCircle className="h-6 w-6 text-primary animate-spin" />
                  </div>
                ) : conversations.length > 0 ? (
                  <div className="flex-1 overflow-y-auto">
                    <ChatList
                      conversations={conversations}
                      active={activeConversation || { id: "", participants: [] }}
                      setConversation={(conv) => setActiveConversation(conv)}
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-muted rounded-2xl bg-card/30">
                    <MessageSquare className="w-10 h-10 mb-3 text-muted-foreground/60" />
                    <p className="font-semibold text-sm">No chats active</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                      Go to the "Explore" tab to join active developer communities!
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Explore Communities Tab */}
              <TabsContent value="explore" className="flex-1 overflow-hidden mt-0 flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search communities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 rounded-xl bg-card border-muted-foreground/20 focus-visible:ring-primary"
                  />
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {filteredCommunities.length > 0 ? (
                    filteredCommunities.map((comm) => {
                      const isJoined = comm.participants?.includes(user.uid);
                      
                      return (
                        <Card key={comm.id} className="border border-muted/80 bg-card/60 hover:bg-card hover:border-primary/20 transition-all shadow-sm rounded-xl">
                          <CardContent className="p-4 flex items-start gap-3">
                            <Avatar className="w-10 h-10 rounded-lg bg-primary/10">
                              <AvatarImage src={comm.avatarUrl} alt={comm.name} />
                              <AvatarFallback className="rounded-lg">
                                {comm.name?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-sm text-foreground truncate">{comm.name}</h4>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium bg-muted px-2 py-0.5 rounded-full">
                                  <Users className="w-3 h-3" />
                                  {comm.participants?.length || 0}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-normal">
                                {comm.description}
                              </p>
                              <div className="flex items-center gap-2 mt-3">
                                {isJoined ? (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => setActiveConversation(comm)}
                                      className="h-8 text-xs font-semibold rounded-lg flex-1 bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                    >
                                      <Check className="w-3.5 h-3.5 mr-1" />
                                      Chat
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => handleLeave(e, comm.id)}
                                      className="h-8 px-2 text-xs font-semibold rounded-lg text-destructive hover:bg-destructive/10"
                                      title="Leave Community"
                                    >
                                      <LogOut className="w-3.5 h-3.5" />
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => handleJoin(comm.id)}
                                    disabled={joiningId === comm.id}
                                    className="h-8 text-xs font-semibold rounded-lg flex-1 bg-primary text-primary-foreground hover:bg-primary/95"
                                  >
                                    {joiningId === comm.id ? (
                                      <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      "Join Community"
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                      <Globe className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm font-medium">No communities found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column: Chat Window */}
          <div className={`flex-1 h-[calc(100vh-140px)] ${activeConversation ? "flex" : "hidden lg:flex"} flex-col items-center justify-center`}>
            {activeConversation ? (
              <CardsChat
                conversation={activeConversation}
                onBack={() => setActiveConversation(null)}
              />
            ) : (
              <Card className="w-full h-full border-2 border-dashed border-muted rounded-2xl bg-card/30 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">Welcome to Community Chats</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-2 leading-relaxed">
                  Select an active direct conversation or join a developer community on the left to start collaborating, sharing code, files, and links with other developers.
                </p>
              </Card>
            )}
          </div>
          
        </main>
      </div>
    </div>
  );
};

export default HomePage;
