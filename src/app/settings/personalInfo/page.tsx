"use client";
import { CalendarDays, Zap, Award } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import EditProfile from "../editprofile/page";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubmissionCalendar from "@/components/SubmissionCalender";
import SidebarMenu from "@/components/menu/sidebarmenu";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import Header from "@/components/header/header";
import { RootState } from "@/lib/store";
import { axiosInstance } from "@/lib/axiosinstance";
// import CreatePost from "@/components/postShowing/page";
import PostShowing from "@/components/postShowing/page";

const PersonalInfoPage = () => {
  const userStats = {
    totalSolved: 847,
    ranking: 12847,
    contestRating: 1847,
    streakDays: 45,
  };

  type RecentPost = {
    _id: string;
    problem: string;
    difficulty: "Easy" | "Medium" | "Hard";
    status: string;
    time: string;
    language: string;
  };

  const user = useSelector((state: RootState) => state.user);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentPost[]>([]);
  const [contributionCount, setContributionCount] = useState(0);
  const userId = user?.uid;

  const [userProfile, setUserProfile] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (!userId) return;

        const res = await axiosInstance.get(`/post/${userId}/userpost`);

        const userPosts = Array.isArray(res.data?.data) ? res.data.data : [];

        const mappedPosts = userPosts.map((post: any) => ({
          _id: post._id,
          content: post.content,
          postType: post.postType,
          tags: post.tags || [],
          likes: post.likes || [],
          comments: post.comments || [],
          shares: post.shares || 0,
          createdAt: post.createdAt,
          codeSnippet: post.codeSnippet,
          difficultyLevel: post.difficultyLevel,
          author: {
            id: post.author,
            name: user?.userName || "You",
            avatar: user?.avatar || "/default-avatar.png",
            level: user?.level || "Beginner",
          },
          contributionCount: post.contributionCount,
        }));

        setRecentSubmissions(mappedPosts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    };

    fetchUserPosts();
  }, [userId]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!userId) return;

        const res = await axiosInstance.get(`/user/${userId}/profile-info`);
        setUserProfile({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
        });
      } catch (error) {
        console.error("Error fetching user profile info:", error);
      }
    };

    fetchUserProfile();
  }, [userId]);
  useEffect(() => {
    const fetchContributionCount = async () => {
      try {
        if (!userId) return;
        const res = await axiosInstance.get(`/post/${userId}/contributions`);
        const count = res.data?.data?.contributionCount ?? 0;
        setContributionCount(count);
      } catch (err) {
        console.error("Error fetching contribution count:", err);
        setContributionCount(0);
      }
    };

    fetchContributionCount();
  }, [userId]);

  const handleDeletePost = (deletedId: string) => {
    setRecentSubmissions((prev) =>
      prev.filter((post) => post._id !== deletedId),
    );
  };

  const badges = [
    {
      name: "100 Days Badge",
      description: "Solved at least one problem for 100 consecutive days",
      earned: true,
    },
    {
      name: "Speed Demon",
      description: "Solved a problem in under 30 seconds",
      earned: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Chats"
      />
      {/* <div className="flex flex-col flex-1 min-h-screen w-full"> */}
          <div className="w-full ml-[30px] px-4 flex-1 md:px-8 lg:px-10 py-4 space-y-8">
        <Header
          menuItemsTop={menuItemsTop}
          menuItemsBottom={menuItemsBottom}
          activeMenu="Projects"
          breadcrumbItems={[{ label: "community feeds", link: "/feeds" }]}
        />

        <div className="max-w-6xl mx-auto px-4 space-y-8">
          {/* Header Section */}
          <Card className="w-full border-0 shadow-lg">
            <CardContent className="w-full p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="w-24 h-24 border-4 border-orange-200">
                  <AvatarImage src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=faces" />
                  <AvatarFallback className="text-2xl bg-orange-100 text-orange-700">
                    JD
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold ">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.displayName || "Guest"}
                    </h1>

                    <p className="text-gray-600 mt-1">
                      Software Engineer at Tech Corp
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Member since January 2022 • San Francisco, CA
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-green-600">
                      <Zap className="w-4 h-4" />
                      <span>{userStats.streakDays} day streak</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {contributionCount}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Contributions
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {/* {userStats.easySolved} */}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Easy</div>
                  {/* <Progress value={65} className="mt-3 h-2" /> */}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">
                    {/* {userStats.mediumSolved} */}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Medium</div>
                  {/* <Progress value={65} className="mt-3 h-2" /> */}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {/* {userStats.hardSolved} */}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Hard</div>
                  {/* <Progress value={25} className="mt-3 h-2" /> */}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="submissions" className="w-full space-y-5">
            {/* <TabsList className="grid w-full grid-cols-4 lg:w-[600px]"> */}
             <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="submissions">Recent Posts</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="calendar">Activity</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
            </TabsList>

            <TabsContent
              value="submissions"
              className="space-y-4 w-full min-h-[400px]"
            >
              <div className="space-y-6 mt-6">
                {recentSubmissions.length > 0 ? (
                  recentSubmissions.map((post: any) => (
                    <PostShowing
                      key={post._id}
                      post={{
                        postId: post._id,
                        author: {
                          id:
                            typeof post.author === "string"
                              ? post.author
                              : post.author?._id,
                          name: post.author?.userName || "Anonymous",
                          avatar: post.author?.avatar || "/default-avatar.png",
                          level: post.author?.level || "Beginner",
                        },
                        content: post.content,
                        type: post.postType ?? "question",
                        tags: post.tags ?? [],
                        likes: post.likes?.length ?? 0,
                        comments: post.comments?.length ?? 0,
                        shares: post.shares ?? 0,
                        timestamp: post.createdAt ?? new Date().toISOString(),
                        codeSnippet: post.codeSnippet,
                        difficulty: post.difficultyLevel ?? "Easy",
                        contributionCount: post.contributionCount,
                      }}
                      currentUserId={userId}
                      onDelete={handleDeletePost}
                    />
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-10">
                    No recent posts found.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="badges"
              className="space-y-4 w-full min-h-[400px]"
            >
              <Card className="w-full border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-orange-600" />
                    Badges & Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="w-full">
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {badges.map((badge, index) => (
                      <div
                        key={index}
                        className={`p-4 border rounded-lg ${
                          badge.earned
                            ? "border-orange-200 bg-orange-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              badge.earned ? "bg-orange-600" : "bg-gray-400"
                            }`}
                          >
                            <Award className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`font-medium ${
                                badge.earned
                                  ? "text-orange-900"
                                  : "text-gray-600"
                              }`}
                            >
                              {badge.name}
                            </h3>
                            <p
                              className={`text-sm mt-1 ${
                                badge.earned
                                  ? "text-orange-700"
                                  : "text-gray-500"
                              }`}
                            >
                              {badge.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="calendar"
              className="space-y-4 w-full min-h-[400px]"
            >
              <Card className="w-full border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-orange-600" />
                    Study Streak
                  </CardTitle>
                </CardHeader>
                {/* <CardContent className="w-full">
                  <SubmissionCalendar />
                </CardContent> */}
                <CardContent className="overflow-x-auto">
                  <div className="max-w-full overflow-x-auto">
                    <div className="w-max mx-auto px-2">
                      <SubmissionCalendar />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent
              value="edit"
              className="space-y-4 w-full min-h-[400px]"
            >
              {user ? (
                <Card className="w-full border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-orange-600" />
                      Edit Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="w-full">
                    <EditProfile />
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-10">Loading...</div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
