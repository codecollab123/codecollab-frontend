'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Trophy, HelpCircle, Plus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CreatePostPage = () => {
  const router = useRouter();

  const [postType, setPostType] = useState<"question" | "solution" | "challenge">("question");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast({
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      description: "Post created successfully! 🎉"
    });

    router.push("/");
  };

  const postTypes = [
    { id: "question", label: "Question", icon: HelpCircle },
    { id: "solution", label: "Solution", icon: Code },
    { id: "challenge", label: "Challenge", icon: Trophy }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Create New Post</h1>
            <p className="text-muted-foreground">
              Share your knowledge, ask questions, or create challenges for the community
            </p>
          </div>

          <form onSubmit={handleSubmit}>
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

            <Card className="mb-6 border border-border">
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-2">
                    Title *
                  </label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a descriptive title..."
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-muted-foreground mb-2">
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

                {(postType === "solution" || postType === "challenge") && (
                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-muted-foreground mb-2">
                      Code Snippet
                    </label>
                    <Textarea
                      id="code"
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                      placeholder="Paste your code here..."
                      className="w-full min-h-[120px] font-mono text-sm"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-muted-foreground mb-2">
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
                  <label htmlFor="tags" className="block text-sm font-medium text-muted-foreground mb-2">
                    Tags
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" onClick={handleAddTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.push("/")}>
                Cancel
              </Button>
              <Button type="submit">
                Create Post
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
