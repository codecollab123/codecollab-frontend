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
import Header from "@/components/header/header";
import CreatePost from "@/components/CreatePost/page";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import { RootState } from "@/lib/store";
import { axiosInstance } from "@/lib/axiosinstance";

const PersonalInfoPage = () => {
  const user = useSelector((state: RootState) => state.user);
  const userId = user?.uid;

  const [userProfile, setUserProfile] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [contributionCount, setContributionCount] = useState(0);

  const userStats = {
    streakDays: 45,
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      try {
        const res = await axiosInstance.get(`/user/${userId}/profile-info`);
        setUserProfile({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    const fetchPosts = async () => {
      if (!userId) return;
      try {
        const res = await axiosInstance.get(`/post/${userId}/userpost`);
        const posts = res.data?.data || [];
        const mapped = posts.map((post: any) => ({
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
            name: user?.name || "You",
            avatar: user?.avatar || "/default-avatar.png",
            level: user?.level || "Beginner",
          },
          contributionCount: post.contributionCount,
        }));
        setRecentSubmissions(mapped);
      } catch (err) {
        console.error("Post fetch error:", err);
      }
    };

    const fetchContributionCount = async () => {
      if (!userId) return;
      try {
        const res = await axiosInstance.get(`/post/${userId}/contributions`);
        setContributionCount(res.data?.data?.contributionCount ?? 0);
      } catch (err) {
        console.error("Contribution count fetch error:", err);
      }
    };

    fetchUserProfile();
    fetchPosts();
    fetchContributionCount();
  }, [userId, user?.avatar, user?.name, user?.level]);

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
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Chats"
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-auto w-full">
        <Header
          menuItemsTop={menuItemsTop}
          menuItemsBottom={menuItemsBottom}
          activeMenu="Projects"
          breadcrumbItems={[{ label: "community feeds", link: "/feeds" }]}
        />

        <main className="max-w-7xl mx-auto px-4 py-6 space-y-8 w-full">
          {/* Profile Card */}
          <Card className="w-full border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="w-24 h-24 border-4 border-orange-200">
                  <AvatarImage src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=faces" />
                  <AvatarFallback className="text-2xl bg-orange-100 text-orange-700">
                    JD
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold">
                      {userProfile?.firstName && userProfile?.lastName
                        ? `${userProfile.firstName} ${userProfile.lastName}`
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-md hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {contributionCount}
                </div>
                <div className="text-sm text-gray-600 mt-1">Contributions</div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600">–</div>
                <div className="text-sm text-gray-600 mt-1">Easy</div>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600">–</div>
                <div className="text-sm text-gray-600 mt-1">Medium</div>
              </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-red-600">–</div>
                <div className="text-sm text-gray-600 mt-1">Hard</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="submissions" className="w-full space-y-5">
            <div className="max-w-6xl mx-auto px-4">
              <TabsList className="grid w-full grid-cols-4 max-w-4xl mx-auto">
                <TabsTrigger value="submissions">Recent Posts</TabsTrigger>
                <TabsTrigger value="badges">Badges</TabsTrigger>
                <TabsTrigger value="calendar">Activity</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent
              value="submissions"
              className="space-y-4 w-full min-h-[400px]"
            >
              <div className="space-y-6 mt-6">
                {recentSubmissions.length > 0 ? (
                  recentSubmissions.map((post) => (
                    <CreatePost
                      key={post._id}
                      post={{
                        postId: post._id,
                        author: post.author,
                        content: post.content,
                        type: post.postType,
                        tags: post.tags,
                        likes: post.likes.length,
                        comments: post.comments.length,
                        shares: post.shares,
                        timestamp: post.createdAt,
                        codeSnippet: post.codeSnippet,
                        difficulty: post.difficultyLevel,
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

            <TabsContent value="badges" className="w-full min-h-[400px]">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-orange-600" />
                    Badges & Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                  {badges.map((badge, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        badge.earned
                          ? "bg-orange-50 border-orange-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 flex items-center justify-center rounded-full ${
                            badge.earned ? "bg-orange-600" : "bg-gray-400"
                          }`}
                        >
                          <Award className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3
                            className={`font-medium ${badge.earned ? "text-orange-900" : "text-gray-600"}`}
                          >
                            {badge.name}
                          </h3>
                          <p
                            className={`text-sm mt-1 ${badge.earned ? "text-orange-700" : "text-gray-500"}`}
                          >
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="calendar" className="w-full min-h-[400px]">
              <Card className="shadow-lg overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CalendarDays className="w-5 h-5 text-orange-600" />
                    Study Streak
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <div className="max-w-full overflow-x-auto">
                    <div className="w-max mx-auto px-2">
                      <SubmissionCalendar />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="w-full min-h-[400px]">
              {user ? (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-orange-600" />
                      Edit Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EditProfile />
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-10">Loading...</div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
