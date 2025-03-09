"use client";

import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; // Axios Instance Import
import { toast } from '@/components/ui/use-toast';
import { axiosInstance } from "@/lib/axiosinstance";

interface CreatePostProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: string; // 👈 User ID as prop
}

const CreatePost: React.FC<CreatePostProps> = ({ open, setOpen,userId }) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (typeof fileReader.result === "string") {
          setImagePreview(fileReader.result);
        }
      };
      fileReader.readAsDataURL(file);
    }
  };

  // 🛠 Post API Call
  const handlePost = async () => {
    if (!imagePreview || !caption.trim()) {
      toast({ description: "Caption and Image are required!", variant: "destructive" });
      return;
    }

    setLoading(true);
    const postData = {
      caption,
      image: imagePreview,
      author: "12345", // Replace with actual user ID
    };

    try {
      await axiosInstance.post(`/post/${userId}`, postData);
      toast({ description: "Post created successfully!", variant: "default" });
      setCaption("");
      setImagePreview("");
      setOpen(false); // Dialog close karna
    } catch (error) {
      toast({ description: "Failed to create post!", variant: "destructive" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>

        {/* User Info */}
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src="/placeholder.jpg" alt="Profile" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">Username</h1>
            <span className="text-gray-600 text-xs">Bio here...</span>
          </div>
        </div>

        {/* Caption Input */}
        <Textarea
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center">
            <img
              src={imagePreview}
              alt="preview"
              className="object-cover h-full w-full rounded-md"
            />
          </div>
        )}

        {/* File Input (Hidden) */}
        <input ref={imageRef} type="file" className="hidden" onChange={fileChangeHandler} />

        {/* Select File Button */}
        <Button
          onClick={() => imageRef.current && imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
        >
          Select from computer
        </Button>

        {/* Post Button */}
        {imagePreview && (
          <Button type="button" className="w-full" onClick={handlePost} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Post"}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
