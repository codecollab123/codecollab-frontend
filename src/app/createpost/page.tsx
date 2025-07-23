"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { Code, Trophy, HelpCircle, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { axiosInstance } from "@/lib/axiosinstance";
import { RootState } from "@/lib/store";
import SidebarMenu from "@/components/menu/sidebarmenu";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import Header from "@/components/header/header";

const CreatePostPage = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const userId = user.uid;

  const [postType, setPostType] = useState<
    "question" | "solution" | "challenge"
  >("question");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const searchParams = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";
  const postId = searchParams.get("id");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">(
    "Easy",
  );

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast({
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      postId, // required for PUT
      title,
      content,
      postType,
      difficultyLevel: difficulty.toLowerCase(), // easy, medium, hard
      tags,
      image: "https://example.com/image.png",
      author: {
        id: user?.uid ?? "",
        name: user.name,
        avatar: user?.avatar ?? "/default-avatar.png",
        level: user?.level ?? "Beginner",
      },
      likes: [],
      comments: [],
    };

    try {
      if (isEdit && postId) {
        const res = await axiosInstance.put(`/post/${postId}`, payload);
        if (res.status === 200) {
          toast({ description: "Post updated successfully!" });
          router.push("/feeds");
        }
      } else {
        const res = await axiosInstance.post(`/post/${userId}`, payload);
        if (res.status === 200 || res.status === 201) {
          toast({ description: "Post created successfully! 🎉" });
          router.push("/feeds");
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isEdit && postId) {
      axiosInstance
        .get(`/post/${postId}`)
        .then((res) => {
          const post = res.data.data;

          setTitle(post.title);
          setContent(post.content);
          setPostType(post.postType);
          setDifficulty(
            post.difficultyLevel.charAt(0).toUpperCase() +
              post.difficultyLevel.slice(1),
          );
          setTags(post.tags);
        })
        .catch((err) => {
          console.error("Failed to load post for editing", err);
          toast({
            description: "Failed to load post for editing.",
            variant: "destructive",
          });
        });
    }
  }, [isEdit, postId]);

  const postTypes = [
    { id: "question", label: "Question", icon: HelpCircle },
    { id: "solution", label: "Solution", icon: Code },
    { id: "challenge", label: "Challenge", icon: Trophy },
  ];

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
        <div className="pt-16 pb-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">
                {isEdit ? "Edit Post" : "Create New Post"}
              </h1>

              <p className="text-muted-foreground">
                Share your knowledge, ask questions, or create challenges for
                the community
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Post Type */}
              <Card className="mb-6 border border-border">
                <CardHeader>
                  <CardTitle>Post Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {postTypes.map((type) => (
                      <Button
                        key={type.id}
                        type="button"
                        variant={postType === type.id ? "default" : "outline"}
                        onClick={() => setPostType(type.id as typeof postType)}
                        className="h-20 flex-col space-y-2"
                      >
                        <type.icon className="w-6 h-6" />
                        <span>{type.label}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Post Details */}
              <Card className="mb-6 border border-border">
                <CardHeader>
                  <CardTitle>Post Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-muted-foreground mb-2"
                    >
                      Title *
                    </label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a descriptive title..."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium text-muted-foreground mb-2"
                    >
                      Content *
                    </label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Describe your question, solution, or challenge in detail..."
                      className="w-full min-h-[120px]"
                    />
                  </div>

                  {/* {(postType === "solution" || postType === "challenge") && (
                    <div>
                    
                    </div>
                  )} */}

                  <div>
                    <label
                      htmlFor="difficulty"
                      className="block text-sm font-medium text-muted-foreground mb-2"
                    >
                      Difficulty Level
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["Easy", "Medium", "Hard"] as const).map((level) => (
                        <Button
                          key={level}
                          type="button"
                          variant={difficulty === level ? "default" : "outline"}
                          onClick={() => setDifficulty(level)}
                          size="sm"
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="tags"
                      className="block text-sm font-medium text-muted-foreground mb-2"
                    >
                      Tags
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag..."
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), handleAddTag())
                        }
                      />
                      <Button type="button" onClick={handleAddTag} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge
                          key={`${tag}-${index}`}
                          variant="secondary"
                          className="flex items-center space-x-1"
                        >
                          <span>#{tag}</span>
                          <Button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Buttons */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/feeds")}
                >
                  Cancel
                </Button>

                <Button type="submit">Create Post</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
