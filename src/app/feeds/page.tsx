"use client";

import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axiosinstance"; 
import SidebarMenu from "@/components/menu/sidebarmenu";
import Header from "@/components/header/header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import CreatePost from "@/components/social/createPost";

interface Post {
  userId: string;
  user: {
    name: string;
    profilePic: string;
  };
  content: string;
  image?: string;
  createdAt: string;
}

import { FC } from "react";
import { toast } from "@/components/ui/use-toast";
import Post from "@/components/post/page";

export const FeedPage: FC<{ userId?: string }> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // if (!userId) return; // Agar userId nahi hai to API call na karein
        // setLoading(true);
        const response = await axiosInstance.get("/post/all", {
          params: {
            userId: userId, // Pass userId same as in BidsPage
          },
        });
        setPosts(response?.data?.data || []);
        console.log("User ID:", userId);

      } catch (error) {
        console.error("Error fetching feed data", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

    // const fetchPosts = async () => {
    //   try {
    //     if (!userId) return; // Agar userId nahi hai to API call na karein
    //     setLoading(true);
    //     const response = await axiosInstance.get("/post/all", {
    //       params: {
    //         userId: userId, // Pass userId same as in BidsPage
    //       },
    //     });
    //     setFeedData(response?.data?.data || []);
    //   } catch (error) {
    //     console.error("Error fetching feed data", error);
    //     toast({
    //       variant: "destructive",
    //       title: "Error",
    //       description: "Something went wrong. Please try again.",
    //     });
    //   } finally {
    //     setLoading(false);
    //   }
    // };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Feed"
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <Header
          menuItemsTop={menuItemsTop}
          menuItemsBottom={menuItemsBottom}
          activeMenu="Feed"
          breadcrumbItems={[{ label: "Feeds", link: "/feed" }]}
        />

       
    <Post/>
      </div>
    </div>
  );
}
export default FeedPage;