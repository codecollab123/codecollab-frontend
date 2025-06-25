"use client";

import { useState } from "react";
import CreatePost from "@/components/CreatePost/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Filter } from "lucide-react";
import SidebarMenu from "@/components/menu/sidebarmenu";
import Header from "@/components/header/header";
import { menuItemsBottom, menuItemsTop } from "@/config/menuItems/dashboardMenuItem";
import Link from "next/link";

const HomePage = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const mockPosts = [
    {
      id: "1",
      author: {
        name: "Alex Chen",
        avatar: "/placeholder.svg",
        level: "Advanced",
      },
      content:
        "Just solved the Two Sum problem in O(n) time! Here's my approach using a hash map...",
      type: "solution" as const,
      tags: ["arrays", "hashing", "leetcode"],
      likes: 24,
      comments: 8,
      shares: 3,
      timestamp: "2h ago",
      codeSnippet: `def two_sum(nums, target):\n    num_map = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in num_map:\n            return [num_map[complement], i]\n        num_map[num] = i\n    return []`,
      difficulty: "Easy" as const,
    },
    {
      id: "2",
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg",
        level: "Intermediate",
      },
      content:
        "Struggling with dynamic programming concepts. Can someone explain the intuition behind the coin change problem?",
      type: "question" as const,
      tags: ["dynamic-programming", "recursion", "help"],
      likes: 15,
      comments: 12,
      shares: 2,
      timestamp: "4h ago",
      difficulty: "Medium" as const,
    },
    {
      id: "3",
      author: {
        name: "Mike Rodriguez",
        avatar: "/placeholder.svg",
        level: "Expert",
      },
      content:
        "🏆 Challenge Alert! Implement a LRU Cache with O(1) operations. First 3 people to solve it get a code review!",
      type: "challenge" as const,
      tags: ["design", "cache", "challenge"],
      likes: 89,
      comments: 25,
      shares: 15,
      timestamp: "6h ago",
      difficulty: "Hard" as const,
    },
  ];

  const filters = [
    { id: "all", label: "All Posts", count: mockPosts.length },
    {
      id: "questions",
      label: "Questions",
      count: mockPosts.filter((p) => p.type === "question").length,
    },
    {
      id: "solutions",
      label: "Solutions",
      count: mockPosts.filter((p) => p.type === "solution").length,
    },
    {
      id: "challenges",
      label: "Challenges",
      count: mockPosts.filter((p) => p.type === "challenge").length,
    },
  ];

  const filteredPosts =
    activeFilter === "all"
      ? mockPosts
      : mockPosts.filter((post) =>
          activeFilter === "questions"
            ? post.type === "question"
            : activeFilter === "solutions"
            ? post.type === "solution"
            : activeFilter === "challenges"
            ? post.type === "challenge"
            : true
        );

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
          breadcrumbItems={[
            { label: "community feeds", link: "/feeds" },
          ]}
        />
         <div className=" pb-20 md:pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                {/* Search */}
                <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Search posts..." className="pl-10" />
                  </div>
                </div>

                {/* Filters */}
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

                {/* Trending Topics */}
                <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground">Trending</h3>
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

            {/* Main Feed */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Your Feed
                </h2>
                <p className="text-muted-foreground">
                  Discover, learn, and share DSA knowledge with the community
                </p>
              </div>
               <Link href="/create-post"> {/* ✅ Replace with your actual route */}
        <Button className="text-sm">+ Create Post</Button>
      </Link>

              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  < CreatePost key={post.id} post={post} />
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No posts found for the selected filter.
                  </p>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                {/* Stats */}
                <div className="bg-card rounded-lg p-4 shadow-sm border border-border">
                  <h3 className="font-semibold text-foreground mb-4">
                    Your Progress
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Problems Solved
                      </span>
                      <span className="font-semibold text-green-600">47</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Contributions
                      </span>
                      <span className="font-semibold text-blue-600">23</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Streak</span>
                      <span className="font-semibold text-orange-600">
                        12 days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Active Challenges */}
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
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default HomePage;
