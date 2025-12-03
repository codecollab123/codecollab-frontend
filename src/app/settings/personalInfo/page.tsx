"use client";
import { CalendarDays, Zap, Award } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import EditProfile from "../editprofile/page";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SidebarMenu from "@/components/menu/sidebarmenu";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import Header from "@/components/header/header";
import { RootState } from "@/lib/store";
import { axiosInstance } from "@/lib/axiosinstance";
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

  interface StreakDay {
    date: string;
    blocks: number;
  }

  const user = useSelector((state: RootState) => state.user);
  const [recentSubmissions, setRecentSubmissions] = useState<RecentPost[]>([]);
  const [contributionCount, setContributionCount] = useState(0);
  const userId = user?.uid;
  const [streakData, setStreakData] = useState<StreakDay[]>([]);
  const [streakCount, setStreakCount] = useState(0);

  const [userProfile, setUserProfile] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);

  function getConsecutiveStreak(data: any) {
    let streak = 0;
    let prevDate: Date | null = null;

    const sorted = [...data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    for (const day of sorted) {
      if (day.blocks === 0) break;

      const currDate = new Date(day.date);

      if (!prevDate) {
        streak++;
      } else {
        const diff =
          (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          streak++;
        } else {
          break;
        }
      }

      prevDate = currDate;
    }

    return streak;
  }

  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        const res = await axiosInstance.get(`/studysolo/streak/${userId}`);
        const data = res.data.data;

        setStreakData(data);
        setStreakCount(getConsecutiveStreak(data));
      } catch (err) {
        console.error("Error fetching streak data", err);
      }
    };

    fetchStreakData();
  }, [userId]);

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
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Chats"
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-screen w-full">
        <Header
          menuItemsTop={menuItemsTop}
          menuItemsBottom={menuItemsBottom}
          activeMenu="Projects"
          breadcrumbItems={[{ label: "community feeds", link: "/feeds" }]}
        />

        {/* Content Area */}
        <main className="w-full">
          <div className="mx-auto w-full max-w-6xl px-4 pb-10 space-y-8">
            {/* Profile Header */}
            <section className="relative mt-4">
              <div className="absolute inset-x-0 -top-4 h-24 bg-gradient-to-r from-emerald-400/20 via-primary/15 to-emerald-500/10 rounded-3xl blur-3xl pointer-events-none" />

              <Card className="relative w-full border border-border/60 bg-card/90 shadow-lg backdrop-blur-sm">
                <CardContent className="w-full p-6 flex flex-col gap-6 md:flex-row md:items-center">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-20 h-20 border-4 border-primary/40 shadow-md">
                      <AvatarImage
                        src={
                          (user as any)?.profilePic ||
                          (user as any)?.photoURL ||
                          "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=faces"
                        }
                      />
                      <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                        {userProfile?.firstName?.[0] ||
                          user?.displayName?.[0] ||
                          "C"}
                        {userProfile?.lastName?.[0] ||
                          user?.displayName?.split(" ")?.[1]?.[0] ||
                          "D"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        {userProfile?.firstName && userProfile?.lastName
                          ? `${userProfile.firstName} ${userProfile.lastName}`
                          : user?.displayName || "Guest Coder"}
                      </h1>

                      <p className="text-sm text-muted-foreground">
                        Full-stack developer • DSA & CP enthusiast • Always
                        shipping.
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/60 px-3 py-1">
                          <Zap className="w-3 h-3 text-primary" />
                          <span>{streakCount || userStats.streakDays}-day
                            coding streak
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/60 px-3 py-1">
                          <CalendarDays className="w-3 h-3 text-primary" />
                          <span>Active contributor</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-wrap justify-start md:justify-end gap-4 text-sm mt-4 md:mt-0">
                    <div className="px-4 py-3 rounded-xl bg-muted/70 border border-border/70 min-w-[130px] text-center">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        Contributions
                      </div>
                      <div className="text-2xl font-bold text-primary mt-1">
                        {contributionCount}
                      </div>
                    </div>
                    <div className="px-4 py-3 rounded-xl bg-muted/70 border border-border/70 min-w-[130px] text-center">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        Total Solved
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {userStats.totalSolved}
                      </div>
                    </div>
                    <div className="px-4 py-3 rounded-xl bg-muted/70 border border-border/70 min-w-[130px] text-center">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        Rating
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {userStats.contestRating}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Stats mini-grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-border/70 bg-card/90 shadow-sm">
                <CardContent className="p-5">
                  <div className="text-xs font-medium text-muted-foreground uppercase">
                    Live streak
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-primary">
                      {streakCount}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      day(s) in a row
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Keep this going! Even a 15-minute session counts as a win.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border/70 bg-card/90 shadow-sm">
                <CardContent className="p-5">
                  <div className="text-xs font-medium text-muted-foreground uppercase">
                    Dev focus
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Solving DSA, building features, and sharing what you learn
                    through posts.
                  </p>
                  <p className="mt-3 text-xs text-primary">
                    Tip: Use this dashboard as your daily coding HQ.
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border/70 bg-card/90 shadow-sm">
                <CardContent className="p-5">
                  <div className="text-xs font-medium text-muted-foreground uppercase">
                    Profile snapshot
                  </div>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <li>• Contributions: {contributionCount}</li>
                    <li>• Posts shared: {recentSubmissions.length}</li>
                    <li>• Rating: {userStats.contestRating}</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Main Content: Tabs */}
            <section>
              <Tabs
                defaultValue="submissions"
                className="w-full space-y-6 mt-2"
              >
                <TabsList className="grid w-full grid-cols-4 lg:w-[600px] bg-muted/80 border border-border/70 rounded-xl">
                  <TabsTrigger
                    value="submissions"
                    className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    Recent Posts
                  </TabsTrigger>
                  <TabsTrigger
                    value="badges"
                    className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    Badges
                  </TabsTrigger>
                  <TabsTrigger
                    value="calendar"
                    className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    Activity
                  </TabsTrigger>
                  <TabsTrigger
                    value="edit"
                    className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    Edit
                  </TabsTrigger>
                </TabsList>

                {/* Recent Posts */}
                <TabsContent
                  value="submissions"
                  className="space-y-4 w-full min-h-[400px]"
                >
                  <Card className="border border-border/70 bg-card/90 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Recent Posts</span>
                        <span className="text-xs font-normal text-muted-foreground">
                          Your latest activity in the CodingCollab community.
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentSubmissions.length > 0 ? (
                        <div className="space-y-4">
                          {recentSubmissions.map((post: any) => (
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
                                  avatar:
                                    post.author?.avatar ||
                                    "/default-avatar.png",
                                  level: post.author?.level || "Beginner",
                                },
                                content: post.content,
                                type: post.postType ?? "question",
                                tags: post.tags ?? [],
                                likes: post.likes?.length ?? 0,
                                comments: post.comments?.length ?? 0,
                                shares: post.shares ?? 0,
                                timestamp:
                                  post.createdAt ?? new Date().toISOString(),
                                codeSnippet: post.codeSnippet,
                                difficulty: post.difficultyLevel ?? "Easy",
                                contributionCount: post.contributionCount,
                              }}
                              currentUserId={userId}
                              onDelete={handleDeletePost}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-2">
                          <p className="text-sm">
                            No recent posts yet. Share your learnings, bugs, or
                            wins with the community ✨
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Badges */}
                <TabsContent
                  value="badges"
                  className="space-y-4 w-full min-h-[400px]"
                >
                  <Card className="w-full border border-border/70 bg-card/90 shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" />
                        Badges & Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="w-full">
                      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {badges.map((badge, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-xl border ${
                              badge.earned
                                ? "border-primary/40 bg-primary/5"
                                : "border-border/70 bg-muted/60"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                                  badge.earned
                                    ? "bg-primary"
                                    : "bg-muted-foreground/40"
                                }`}
                              >
                                <Award className="w-4 h-4 text-primary-foreground" />
                              </div>
                              <div className="flex-1">
                                <h3
                                  className={`font-semibold text-sm ${
                                    badge.earned
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {badge.name}
                                </h3>
                                <p
                                  className={`text-xs mt-1 ${
                                    badge.earned
                                      ? "text-muted-foreground"
                                      : "text-muted-foreground/80"
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

                {/* Activity / Streak Calendar */}
                <TabsContent
                  value="calendar"
                  className="space-y-4 w-full min-h-[400px]"
                >
                  <Card className="border border-border/70 bg-card/90 shadow-md">
                    <CardHeader className="flex flex-col gap-2">
                      <CardTitle className="flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-primary" />
                        Activity Overview
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        🔥 Streak: {streakCount} day(s) — green blocks represent
                        days you showed up and coded.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-7 gap-1 text-[10px] text-muted-foreground">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {streakData.map((day) => (
                          <div
                            key={day.date}
                            title={`${day.date} - ${day.blocks} block(s)`}
                            className={`w-4 h-4 rounded-sm ${
                              day.blocks > 0
                                ? "bg-primary"
                                : "bg-muted-foreground/20"
                            }`}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Edit Profile */}
                <TabsContent
                  value="edit"
                  className="space-y-4 w-full min-h-[400px]"
                >
                  {user ? (
                    <Card className="w-full border border-border/70 bg-card/90 shadow-md">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CalendarDays className="w-5 h-5 text-primary" />
                          Edit Profile
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="w-full">
                        <EditProfile />
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                      Loading profile...
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
