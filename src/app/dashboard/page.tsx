"use client";

import {
  Flame,
  Plus,
  Code,
  FileText,
  MessageCircle,
  Calendar,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { axiosInstance } from "@/lib/axiosinstance";
import SidebarMenu from "@/components/menu/sidebarmenu";
import Header from "@/components/header/header";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardCalendar from "@/components/calender";

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
};
const activityTextMap: any = {
  CREATED_POST: "You created a new post",
  JOINED_ROOM: "You joined a compiler room",
  VIEWED_NOTES: "You viewed notes",
  CREATED_NOTE: "You created a note",
};

const format24HourTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function Dashboard() {
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("USER ID FROM STORAGE:", userId);

    if (!userId) {
      console.warn(" No userId in localStorage");
      return;
    }

    const fetchActivity = async () => {
      try {
        setLoading(true);

        const res = await axiosInstance.get(`/activity/${userId}/recent`);

        console.log("✅ ACTIVITY RESPONSE:", res.data);
        setRecentActivities(res.data.data || []);
      } catch (err) {
        console.error("❌ ACTIVITY ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0d0d0d] text-white">
      {/* Sidebar */}
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="dashboard"
      />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Header
          menuItemsTop={menuItemsTop}
          menuItemsBottom={menuItemsBottom}
          activeMenu="Dashboard"
          breadcrumbItems={[{ label: "dashboard", link: "/dashboard" }]}
        />

        <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-lg border border-white/10 mb-10 max-w-6xl mx-auto">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center brightness-[0.45]"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=60&w=1200')",
            }}
          />

          {/* Overlay Content */}
          <div className="relative z-10 flex items-center justify-between h-full px-6">
            {/* LEFT SIDE */}
            <div className="flex flex-col">
              {/* Title */}
              <h2 className="text-2xl font-bold mt-2">Solo Study Room</h2>

              {/* Subtitle */}
              <p className="text-gray-200/90 text-sm mt-1 max-w-md">
                <b>100% focus?</b> Set the scene with atmospheric backgrounds,
                use timer and goal setting — and study in your solo study room.
              </p>

              {/* Info button */}
              <button className="mt-3 w-7 h-7 flex items-center justify-center text-white text-lg rounded-md bg-teal-600 hover:bg-teal-500 transition">
                i
              </button>
            </div>

            {/* RIGHT SIDE: icons + CTA */}
            <div className="flex items-center space-x-4">
              {/* Button */}
              <button className="px-6 py-2 bg-white text-[#ff4f4f] font-semibold rounded-xl shadow hover:bg-gray-100 transition flex items-center space-x-2">
                <span>➤</span>
                <span>Start solo study</span>
              </button>
            </div>
          </div>
        </div>

        {/* GRID CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 mx-auto max-w-6xl">
          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-[#161616] border border-white/10 rounded-2xl shadow-xl">
              <CardContent className="p-6 flex items-center space-x-4">
                <Flame className="w-12 h-12 " />
                <div>
                  <h3 className="text-xl font-semibold">Study Streak</h3>
                  <p className="text-green-500 text-sm">7 days active </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Create Post */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              onClick={() => router.push("/createpost")}
              className="bg-[#161616] border border-white/10 rounded-2xl shadow-xl"
            >
              <CardContent className="p-6 flex items-center space-x-4">
                <Plus className="w-12 h-12 " />
                <div>
                  <h3 className="text-xl font-semibold">Create New Post</h3>
                  <p className="text-green-500 text-sm">
                    Question, Solution or Challenge
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Feeds */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              onClick={() => router.push("/feeds")}
              className="bg-[#161616] border border-white/10 rounded-2xl shadow-xl"
            >
              <CardContent className="p-6 flex items-center space-x-4">
                <Plus className="w-12 h-12 " />
                <div>
                  <h3 className="text-xl font-semibold">Feeds</h3>
                  <p className="text-green-500 text-sm">
                    Question, Solution or Challenge
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Compiler Rooms */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              onClick={() => router.push("/createroom")}
              className="bg-[#161616] border border-white/10 rounded-2xl shadow-xl"
            >
              <CardContent className="p-6 flex items-center space-x-4">
                <Code className="w-12 h-12" />
                <div>
                  <h3 className="text-xl font-semibold">Coding Rooms</h3>
                  <p className="text-green-500 text-sm">
                    Collaborative coding rooms
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              onClick={() => router.push("/notes")}
              className="bg-[#161616] border border-white/10 rounded-2xl shadow-xl"
            >
              <CardContent className="p-6 flex items-center space-x-4">
                <FileText className="w-12 h-12 " />
                <div>
                  <h3 className="text-xl font-semibold">Notes</h3>
                  <p className="text-green-500 text-sm">
                    Save and access your notes
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chat */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-[#161616] border border-white/10 rounded-2xl shadow-xl">
              <CardContent className="p-6 flex items-center space-x-4">
                <MessageCircle className="w-12 h-12 " />
                <div>
                  <h3 className="text-xl font-semibold">Community and Chats</h3>
                  <p className="text-green-500 text-sm">
                    Talk with your study buddies
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* BOTTOM SECTION LIKE CODOLIO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10 max-w-6xl mx-auto">
          {/* Left Section – Recent Activity */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            {loading && <p className="text-gray-400 mt-2">Loading...</p>}

            {!loading && recentActivities.length === 0 && (
              <p className="text-gray-400 mt-2">No recent activities found</p>
            )}

            {recentActivities.map((activity) => (
              <Card
                key={activity._id}
                className="bg-[#161616] border border-white/10 p-5 mt-3"
              >
                <div className="flex justify-between">
                  <p className="text-gray-300">
                    {activity.action === "CREATED_POST"
                      ? `You created a post: "${activity.meta?.title || "Untitled"}"`
                      : activity.action === "SOLO_STUDY"
                        ? `You studied for ${activity.meta?.duration || 0} minutes`
                        : activityTextMap[activity.action] || activity.action}
                  </p>
                  <span className="text-green-400 text-sm">
                    {formatTimeAgo(activity.createdAt)}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Right Widgets */}
          <div className="space-y-6">
            <DashboardCalendar />

            {/* Portfolio */}
            <Card className="bg-[#161616] border border-white/10 p-6 rounded-2xl">
              <div className="flex items-center space-x-3 mb-3">
                <BarChart3 className="text-blue-500" />
                <h3 className="text-lg font-semibold">Portfolio</h3>
              </div>
              <p className="text-gray-400 text-sm">Profile Views: 12</p>
              <p className="text-gray-400 text-sm">Last Refresh: Today</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
