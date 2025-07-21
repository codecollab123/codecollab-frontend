"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { axiosInstance } from "@/lib/axiosinstance";
import SubmissionCalendar from "@/components/SubmissionCalender";
import CreatePost from "@/components/CreatePost/page";
import SidebarMenu from "@/components/menu/sidebarmenu";
import { menuItemsBottom, menuItemsTop } from "@/config/menuItems/dashboardMenuItem";
import Header from "@/components/header/header";

const UserProfilePage = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userPosts, setUserPosts] = useState([]);
  const [contributionCount, setContributionCount] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axiosInstance.get(`/user/${userId}/profile-info`);
        setUserProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await axiosInstance.get(`/post/${userId}/userpost`);
        setUserPosts(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };

    const fetchContributionCount = async () => {
      try {
        const res = await axiosInstance.get(`/post/${userId}/contributions`);
        setContributionCount(res.data?.data?.contributionCount ?? 0);
      } catch (err) {
        console.error("Failed to fetch contributions:", err);
      }
    };

    if (userId) {
      fetchUserProfile();
      fetchUserPosts();
      fetchContributionCount();
    }
  }, [userId]);

return (
  <div className="flex min-h-screen bg-background text-foreground">
    {/* Sidebar */}
    <SidebarMenu
      menuItemsTop={menuItemsTop}
      menuItemsBottom={menuItemsBottom}
      active="Chats"
    />

    {/* Right Content */}
    <div className="flex flex-col flex-1 min-h-screen w-full">
      <Header
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        activeMenu="Projects"
        breadcrumbItems={[{ label: "User Profile", link: `/profile/${userId}` }]}
      />

      {/* Main content */}
      <div className="px-4 sm:px-6 py-8 max-w-5xl mx-auto space-y-8">
        {/* Profile Card */}
        <Card className="rounded-2xl shadow-lg border border-muted">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border shadow">
              <AvatarImage src={userProfile?.profilePic || "/user.png"} />
              <AvatarFallback>
                {userProfile?.firstName?.[0]}
                {userProfile?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold">
                {userProfile?.firstName} {userProfile?.lastName}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {userProfile?.bio || "No bio provided yet."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="rounded-xl border border-muted shadow-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-lg font-medium text-white">
                Contributions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-3xl font-bold text-orange-600">
              {contributionCount}
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-muted shadow-sm overflow-hidden">
            <CardHeader className="flex items-center gap-2 pb-2">
              <CalendarDays className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-lg font-medium text-gray-300">
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <div className="min-w-[500px]">
                <SubmissionCalendar />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white-800">Posts</h3>
          {userPosts.length > 0 ? (
            userPosts.map((post: any) => (
              <CreatePost
                key={post._id}
                post={{
                  postId: post._id,
                  author: {
                    id: post.author,
                    name: `${userProfile?.firstName || "Anonymous"} ${
                      userProfile?.lastName || ""
                    }`,
                    avatar: userProfile?.profilePic || "/user.png",
                    level: userProfile?.level || "Beginner",
                  },
                  content: post.content,
                  type: post.postType,
                  tags: post.tags || [],
                  likes: post.likes?.length || 0,
                  comments: post.comments?.length || 0,
                  shares: post.shares || 0,
                  timestamp: post.createdAt,
                  codeSnippet: post.codeSnippet,
                  difficulty: post.difficultyLevel || "Easy",
                }}
                currentUserId={""}
                onDelete={() => {}}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No posts yet.</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

}

export default UserProfilePage;
