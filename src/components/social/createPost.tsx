"use client";

import { useState } from "react";
// import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X } from "lucide-react";

export default function CreatePost() {
  const [postContent, setPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handlePost = () => {
    if (postContent.trim() || selectedFile) {
      console.log("Posting:", postContent, "File:", selectedFile);
      setPostContent("");
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Card className="w-full max-w-7xl mx-auto mt-6 shadow-md">
      <CardContent className="flex flex-col sm:flex-row items-start gap-3 p-4">

        {/* Input Box */}
        <div className="flex-1 w-full">
          <Textarea
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="w-full h-24 sm:h-32 resize-none p-3 border border-green-400 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Image Preview */}
          {preview && (
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 mt-2">
              <img src={preview} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
              <button
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
                onClick={() => {
                  setPreview(null);
                  setSelectedFile(null);
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Upload & Post Buttons */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-between mt-3 gap-3">
            {/* Upload Button */}
            <label className="flex items-center cursor-pointer gap-2 text-gray-600 hover:text-gray-800">
              <Upload size={20} />
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Post Button */}
            <Button
              onClick={handlePost}
              className="w-full sm:w-auto text-white px-4 py-2 rounded-lg"
              disabled={!postContent.trim() && !selectedFile}
            >
              Post
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
