"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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
  id: string;
  user: {
    name: string;
    profilePic: string;
  };
  content: string;
  image?: string;
  createdAt: string;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("https://api.com/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
          breadcrumbItems={[ { label: "Feeds", link: "/feed" }]}
        />

        <div className="mt-6 px-4 max-w-3xl ml-11">
          <h1 className="text-2xl font-bold">Latest Posts</h1>
          <p className="text-gray-600 mt-1">
          See what others are sharing.
          </p>
        </div>
    <CreatePost/>
        {/* Posts Feed */}
        {loading ? (
          <Skeleton className="h-40 w-full mb-4" />
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="mb-4">
              <CardContent className="p-4">
                {/* User Info */}
                <div className="flex items-center mb-2">
                  <Avatar>
                    <img src={post.user.profilePic} alt={post.user.name} />
                  </Avatar>
                  <div className="ml-3">
                    <h2 className="text-sm font-bold">{post.user.name}</h2>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-gray-800">{post.content}</p>

                {/* Post Image (if any) */}
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post Image"
                    className="mt-3 rounded-lg w-full"
                  />
                )}

                {/* Like & Comment Buttons */}
                <div className="flex gap-4 mt-3">
                  <Button variant="ghost">❤️ Like</Button>
                  <Button variant="ghost">💬 Comment</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
