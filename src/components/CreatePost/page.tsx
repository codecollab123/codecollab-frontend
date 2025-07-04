"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Share2,
  Code,
  Trophy,
  HelpCircle,
  Trash2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { axiosInstance } from "@/lib/axiosinstance";

interface Post {
  postId: string;
  author: {
    id?: string; // added this so we can match current user
    name: string;
    avatar: string;
    level: string;
  };
  content: string;
  type: "question" | "solution" | "challenge";
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  codeSnippet?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  contributionCount?: number;
}

interface CreatePostProps {
  post: Post;
  currentUserId?: string;
  onDelete?: (postId: string) => void;
}

const CreatePost = ({ post, currentUserId, onDelete }: CreatePostProps) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    toast({
      description: liked ? "Removed from favorites" : "Added to favorites!",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out this ${post.type} on DSA Hub!`);
    toast({
      description: "Link copied to clipboard!",
    });
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/post/${post.postId}`);
      toast({ description: "Post deleted successfully" });
      console.log("Post Author:", post.author);
      console.log("Current User:", currentUserId);

      if (onDelete) onDelete(post.postId);
    } catch (error: any) {
      toast({
        description: error?.response?.data?.message || "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const getTypeColor = () => {
    switch (post.type) {
      case "question":
        return "bg-orange-200 text-orange-900 dark:bg-orange-600/20 dark:text-orange-400";
      case "solution":
        return "bg-green-200 text-green-900 dark:bg-green-600/20 dark:text-green-400";
      case "challenge":
        return "bg-purple-200 text-purple-900 dark:bg-purple-600/20 dark:text-purple-400";
    }
  };

  const getDifficultyColor = () => {
    switch (post.difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-600/20 dark:text-green-400";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-600/20 dark:text-yellow-400";
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-600/20 dark:text-red-400";
      default:
        return "";
    }
  };

  return (
    <Card className="mb-6 hover:shadow-lg transition-shadow duration-200 bg-card text-foreground border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>
                {post.author.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{post.author.name}</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {post.author.level}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {post.timestamp}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className={`${getTypeColor()} border-0`}>
              {post.type === "question" && <HelpCircle className="w-4 h-4" />}
              {post.type === "solution" && <Code className="w-4 h-4" />}
              {post.type === "challenge" && <Trophy className="w-4 h-4" />}
              <span className="ml-1 capitalize">{post.type}</span>
            </Badge>
            {post.difficulty && (
              <Badge className={`${getDifficultyColor()} border-0`}>
                {post.difficulty}
              </Badge>
            )}
            {/* {
  (post.author?.id === currentUserId ) && ( // 👈 FOR TESTING ONLY
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      className="text-red-500 hover:text-red-700"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
} */}
            {currentUserId === post.author?.id && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
             )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 leading-relaxed">
          {post.content}
        </p>

        {post.codeSnippet && (
          <div className="bg-muted rounded-lg p-4 mb-4 border border-border">
            <div className="flex items-center space-x-2 mb-2">
              <Code className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Code Snippet
              </span>
            </div>
            <pre className="text-sm overflow-x-auto text-foreground">
              <code>{post.codeSnippet}</code>
            </pre>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs text-muted-foreground border-border"
            >
              #{tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-2 ${
                liked ? "text-red-500" : "text-muted-foreground"
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
              <span>{likesCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-muted-foreground"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-2 text-muted-foreground"
            >
              <Share2 className="w-4 h-4" />
              <span>{post.shares}</span>
            </Button>
          </div>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Comments section would go here...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatePost;
