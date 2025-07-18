"use client";

import { useEffect, useState } from "react";
import { Search, TrendingUp, Filter } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

import { axiosInstance } from "@/lib/axiosinstance";
import CreatePost from "@/components/CreatePost/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SidebarMenu from "@/components/menu/sidebarmenu";
import Header from "@/components/header/header";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import { RootState } from "@/lib/store";
import { getFeedSocket } from "@/service/liveFeedSocket";
import PofdComponent from "@/components/pofd";

type Post = {
  _id: string;
  postType: "question" | "solution" | "challenge";
  content: string;
  author: {
    id: string;
    // name: string;
    avatar: string;
    level: string;
  };
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  codeSnippet?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  contributionCount?: number;
};
type Pofd = {
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  source: string;
  date: string;
};

const FeedPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  type User = {
    uid: string;
  };

  const user = useSelector((state: RootState) => state.user) as User | null;
  const userId = user?.uid;
  const [contributionCount, setContributionCount] = useState<number>(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pofd, setPofd] = useState<Pofd | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/post/all");
      const postData = response.data?.data;
      setPosts(postData || []);
    } catch (error: any) {
      console.error("Error fetching posts:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getContributionCount = async (userId: string) => {
    try {
      const res = await axiosInstance.get(`/post/${userId}/contributions`);
      const count = res.data?.data?.contributionCount ?? 0;
      setContributionCount(count); // <-- SETTING THE STATE
    } catch (error) {
      console.error(
        `❌ Error fetching contribution count for ${userId}:,
        error`
      );
      setContributionCount(0); // fallback to 0 if API fails
    }
  };
  const handleDeletePost = (deletedId: string) => {
    console.log("Deleted post ID:", deletedId);
    setPosts(
      (prev) => prev.filter((post) => post._id !== deletedId) // make sure it's 'id' not '_id'
    );
  };
  // const fetchPofd = async () => {
  //   try {
  //     const res = await axiosInstance.get("/pofd/today");
  //     setPofd(res.data?.data || null);
  //   } catch (err) {
  //     console.error("Error fetching PoFD:", err);
  //   }
  // };
  const filters = [
    { id: "all", label: "All Posts", count: posts.length },
    {
      id: "question",
      label: "Questions",
      count: posts.filter((p) => p.postType === "question").length,
    },
    {
      id: "solution",
      label: "Solutions",
      count: posts.filter((p) => p.postType === "solution").length,
    },
    {
      id: "challenge",
      label: "Challenges",
      count: posts.filter((p) => p.postType === "challenge").length,
    },
  ];

  const filteredPosts =
    activeFilter === "all"
      ? posts
      : posts.filter((post) => post.postType === activeFilter);

  useEffect(() => {
    getPosts(); // initial fetch
    // fetchPofd();
    if (userId) {
      getContributionCount(userId);
    }

    const socket = getFeedSocket(userId);

    socket.on("receive_post", (newPost: Post) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    });

    return () => {
      socket.off("receive_post");
    };
  }, [userId]);

  return (
    <div className="min-h-screen bg-background text-foreground">
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
          breadcrumbItems={[{ label: "community feeds", link: "/feeds" }]}
        />
        <div className="pb-20 md:pb-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <div className="sticky top-20 space-y-6">
                  <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input placeholder="Search posts..." className="pl-10" />
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
                    <div className="flex items-center space-x-2 mb-4">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-semibold text-foreground">Filters</h3>
                    </div>
                    <div className="space-y-2">
                      {filters.map((filter) => (
                        <Button
                          key={filter.id}
                          variant={
                            activeFilter === filter.id ? "default" : "ghost"
                          }
                          size="sm"
                          onClick={() => setActiveFilter(filter.id)}
                          className="w-full justify-between"
                        >
                          <span>{filter.label}</span>
                          <Badge variant="secondary" className="ml-2">
                            {filter.count}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
                    <div className="flex items-center space-x-2 mb-4">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-semibold text-foreground">
                        Trending
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "binary-search",
                        "dynamic-programming",
                        "graphs",
                        "trees",
                        "sorting",
                      ].map((topic) => (
                        <Badge
                          key={topic}
                          variant="outline"
                          className="cursor-pointer hover:bg-muted transition"
                        >
                          #{topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Your Feed
                  </h2>
                  <p className="text-muted-foreground">
                    Discover, learn, and share DSA knowledge with the community
                  </p>
                </div>
                <Link href="/create-post">
                  <Button className="text-sm mb-2">+ Create Post</Button>
                </Link>
                {/* {pofd && (
                  <div className="bg-yellow-50 dark:bg-green-900/20 border border-green-500 dark:border-yellow-700 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-bold text-green-800 dark:text-green-400">
                      📌 Problem of the Day ({pofd.date})
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">Title:</span> {pofd.title}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="font-medium">Difficulty:</span>{" "}
                      {pofd.difficulty}
                    </p>
                    <p className="text-sm text-foreground mb-2">
                      <span className="font-medium">Description:</span>{" "}
                      {pofd.description}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Source:</span> {pofd.source}
                    </p>
                  </div>
                )} */}
                <PofdComponent/>

                {isLoading ? (
                  <p className="text-muted-foreground py-10 text-center">
                    Loading posts...
                  </p>
                ) : filteredPosts.length === 0 ? (
                  <p className="text-muted-foreground py-10 text-center">
                    No posts found for the selected filter.
                  </p>
                ) : (
                  <div className="space-y-6 mt-6">
                    {filteredPosts.map((post) => (
                      <CreatePost
                        key={post._id}
                        post={{
                          postId: post._id,
                          author: {
                            id:
                              typeof post.author === "string"
                                ? post.author
                                : post.author?.id,
                            // name: post.author?.name || "Anonymous",
                            name: "Anonymous",

                            avatar:
                              post.author?.avatar || "/default-avatar.png",
                            level: post.author?.level || "Beginner",
                          },
                          content: post.content,
                          type: post.postType ?? "question", // 👈 use post.postType instead of post.type
                          tags: post.tags ?? [],
                          likes: post.likes ?? 0,
                          comments: post.comments ?? 0,
                          shares: post.shares ?? 0,
                          timestamp: post.timestamp ?? new Date().toISOString(),
                          codeSnippet: post.codeSnippet,
                          difficulty: post.difficulty ?? "Easy",
                          contributionCount: post.contributionCount,
                        }}
                        currentUserId={userId}
                        onDelete={handleDeletePost}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-20 space-y-6">
                  <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
                    <h3 className="font-semibold text-foreground mb-4">
                      Your Progress
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Problems Solved
                        </span>
                        <span className="font-semibold text-green-600">47</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Contributions
                        </span>
                        <span className="font-semibold text-blue-600">
                          {contributionCount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Streak</span>
                        <span className="font-semibold text-orange-600">
                          12 days
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
                    <h3 className="font-semibold text-foreground mb-4">
                      Active Challenges
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <p className="text-sm font-medium text-purple-800 dark:text-purple-300">
                          Weekly Contest #45
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                          Ends in 2 days
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <p className="text-sm font-medium text-green-800 dark:text-green-300">
                          Graph Algorithms
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          5/10 completed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End Right Sidebar */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
