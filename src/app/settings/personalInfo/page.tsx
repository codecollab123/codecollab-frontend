"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Code,
  HelpCircle,
  Calendar,
  MapPin,
  Github,
  Linkedin,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import SidebarMenu from "@/components/menu/sidebarmenu";
import Header from "@/components/header/header";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import Link from "next/link";

const personalInfo: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const userStats = [
    {
      label: "Problems Solved",
      value: 47,
      icon: Code,
      color: "text-green-600",
    },
    {
      label: "Questions Asked",
      value: 12,
      icon: HelpCircle,
      color: "text-blue-600",
    },
    {
      label: "Challenges Won",
      value: 3,
      icon: Trophy,
      color: "text-yellow-600",
    },
  ];

  const recentActivity = [
    {
      type: "solution",
      title: "Two Sum Problem",
      timestamp: "2 hours ago",
      likes: 15,
    },
    {
      type: "question",
      title: "Dynamic Programming Help",
      timestamp: "1 day ago",
      likes: 8,
    },
    {
      type: "challenge",
      title: "Binary Tree Challenge",
      timestamp: "3 days ago",
      likes: 32,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen w-full">
        <SidebarMenu
          menuItemsTop={menuItemsTop}
          menuItemsBottom={menuItemsBottom}
          active=""
        />

        <div className="flex-1 flex flex-col w-full">
          {/* Header */}
          <Header
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            activeMenu="Projects"
            breadcrumbItems={[
              { label: "personalInfo", link: "/settings/personalInfo" },
            ]}
          />

          {/* Profile Content */}
          <div className="pt-4 pb-10">
            <div className="max-w-6xl mx-auto px-4">
              {/* Profile Header */}
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="relative">
                      <Avatar className="w-32 h-32 border-4 border-green-400 neon-glow">
                        {user?.photoURL ? (
                          <AvatarImage src={user.photoURL} alt="Profile" />
                        ) : (
                          <AvatarFallback>TR</AvatarFallback>
                        )}
                        <AvatarFallback className="text-2xl">CM</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1">
                      

                      <p className="text-gray-600 mb-4">
                        Full-stack developer passionate about algorithms and
                        data structures
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>San Francisco, CA</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Joined March 2024</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className="bg-blue-100 text-blue-800">
                          React
                        </Badge>
                        <Badge className="bg-green-100 text-green-800">
                          Python
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-800">
                          Algorithms
                        </Badge>
                        <Badge className="bg-orange-100 text-orange-800">
                          JavaScript
                        </Badge>
                      </div>

                      <div className="flex space-x-4">
                        <Button variant="outline" size="sm">
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                        </Button>
                        <Button variant="outline" size="sm">
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </Button>
                      </div>
                    </div>

                    <div className="flex md:flex-col space-x-4 md:space-x-0 md:space-y-2">
                      <Button asChild>
                        <Link href="/settings/editprofile">Edit Profile</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="lg:col-span-1 space-y-6">
                  {userStats.map((stat, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">
                              {stat.label}
                            </p>
                            <p className="text-2xl font-bold text-white">
                              {stat.value}
                            </p>
                          </div>
                          {/* <stat.icon className={`w-8 h-8 ${stat.color}`} /> */}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Achievements */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        <span>Achievements</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">First Solution</span>
                          <Badge className="bg-green-100 text-green-800">
                            ✓
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">10 Day Streak</span>
                          <Badge className="bg-blue-100 text-blue-800">✓</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">50 Problems Solved</span>
                          <Badge variant="outline">47/50</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Tabs */}
                <div className="lg:col-span-2 flex-1">
                  <Tabs defaultValue="activity" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="activity">
                        Recent Activity
                      </TabsTrigger>
                      <TabsTrigger value="posts">My Posts</TabsTrigger>
                      <TabsTrigger value="solutions">Solutions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="activity" className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {activity.type === "solution" && (
                                  <Code className="w-5 h-5 text-green-600" />
                                )}
                                {activity.type === "question" && (
                                  <HelpCircle className="w-5 h-5 text-blue-600" />
                                )}
                                {activity.type === "challenge" && (
                                  <Trophy className="w-5 h-5 text-purple-600" />
                                )}
                                <div>
                                  <h3 className="font-semibold text-gray-400">
                                    {activity.title}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {activity.timestamp}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="secondary">
                                {activity.likes} likes
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>

                    <TabsContent value="posts">
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-center text-gray-500">
                            Your posts will appear here
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="solutions">
                      <Card>
                        <CardContent className="pt-6">
                          <p className="text-center text-gray-500">
                            Your solutions will appear here
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default personalInfo;
