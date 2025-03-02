"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X } from "lucide-react"; // Import Lucide React icons

export default function CreatePost() {
  const [postContent, setPostContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handlePost = () => {
    if (postContent.trim() || selectedFile) {
      console.log("Posting:", postContent, "File:", selectedFile);
      setPostContent("");
      setSelectedFile(null);
      setPreview(null); // Clear the file preview
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Generate a preview URL
    }
  };

  return (
    <Card className="w-full max-w-7xl mx-auto mt-6 shadow-md">
      <CardContent className="flex items-start gap-3 p-4">

        {/* Input Box */}
        <div className="flex-1">
          <Textarea
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="w-full h-24 resize-none p-3 border border-green-400 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Image Preview */}
          {preview && (
  <div className="relative w-24 h-24 mt-2"> {/* Reduced mt-3 to mt-2 */}
    <img src={preview} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
    <button
      className="absolute top-1 right-1 bg-red-800 text-white rounded-full p-1"
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
          <div className="flex items-center justify-between mt-2 gap-3">
  {/* Upload Button */}
  <label className="flex items-center cursor-pointer gap-2 text-gray-400 hover:text-gray-800">
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
    className="text-white px-4 py-2 rounded-lg"
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
