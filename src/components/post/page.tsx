import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { MessageCircle, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const StudyPost = () => {
  return (
    <Card className="w-full max-w-3xl mx-auto my-6 border border-gray-300 rounded-lg ">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="border border-gray-300">
              <AvatarImage src="/default-profile.png" alt="User Avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-gray-400 text-lg">username</h1>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <MoreHorizontal className="cursor-pointer text-gray-600 hover:text-gray-800" />
            </DialogTrigger>
            <DialogContent className="flex flex-col text-sm">
              <Button variant="ghost" className="w-full">Report</Button>
              <Button variant="ghost" className="w-full text-red-500">Hide</Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-md overflow-hidden">
          <img className="w-full object-cover h-56" src="https://www.simplilearn.com/ice9/free_resources_article_thumb/Trees-Soni/sibling-of-tree-data-structure1.png" alt="Post" />
        </div>
{/* caption */}
        <div className="mt-4">
          <h2 className="font-semibold text-lg text-gray-500">Understanding Data Structures</h2>
          <p className=" text-gray-500">
            A quick guide to mastering fundamental data structures for efficient problem-solving. Learn about arrays, linked lists, trees, and graphs.
          </p>
        </div>

        <span className="text-sm text-gray-500 mt-3 block">
          5 comments
        </span>

        <div className="flex items-center gap-2 mt-3 border-t pt-3">
          <input
            type="text"
            placeholder="Share your thoughts..."
            className="flex-1 text-sm p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
          />
          <Button variant="outline" className="px-4 py-1 text-blue-600 border-blue-500">Post</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyPost;
