
import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Send,
  Reply,
  X,
  Bold,
  Italic,
  Underline,
  PanelRight,
} from 'lucide-react';
import { Textarea } from "../ui/textarea";

type User = {
  userName: string;
  email: string;
  profilePic: string;
};

type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  replyTo?: string | null;
};

const ChatComponent: React.FC = () => {
  const [primaryUser, setPrimaryUser] = useState<User>({
    userName: 'Isha',
    email: 'isha@gmai.com',
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [replyToMessageId, setReplyToMessageId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true); // Sidebar visibility
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const user = { uid: "user123" }; // Mock user ID

  // Handle Sending Message
  const sendMessage = () => {
    if (input.trim().length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.uid,
      content: input,
      timestamp: new Date().toISOString(),
      replyTo: replyToMessageId || null,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput("");
    setReplyToMessageId(null);
  };

  // Handle Replying to a Message
  const handleReply = (messageId: string) => {
    setReplyToMessageId(messageId);
  };

  // Apply text formatting
  const formatText = (symbol: string) => {
    if (!textAreaRef.current) return;

    const textarea = textAreaRef.current;
    const { selectionStart, selectionEnd, value } = textarea;

    if (selectionStart === selectionEnd) return;

    const selectedText = value.slice(selectionStart, selectionEnd);
    const newText = `${value.slice(0, selectionStart)}${symbol}${selectedText}${symbol}${value.slice(selectionEnd)}`;

    setInput(newText);
    textarea.setSelectionRange(selectionStart + symbol.length, selectionEnd + symbol.length);
  };

  return (
    <Card
  className={`fixed top-32 mr-7 right-0 h-[75%] p-4 bg-gray-100 rounded-lg shadow-lg transition-all ${isOpen ? "w-80 " : "w-0"}`}
  style={{ zIndex: 9999, transition: "width 0.3s ease, opacity 0.3s ease" }}
>
  {isOpen && (
    <CardHeader className="flex flex-row items-center border-b-2 p-3">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={primaryUser.profilePic} alt="Profile Image" />
          <AvatarFallback>{primaryUser.userName}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none text-gray-800">{primaryUser.userName}</p>
          <p className="text-sm text-gray-500">{primaryUser.email}</p>
        </div>
      </div>
    </CardHeader>
  )}

  {/* Messages List */}
  {isOpen && (
    <CardContent className="space-y-3 overflow-y-auto h-[75%]">
      {messages.map((message) => (
        <div key={message.id} className="p-2  bg-green-100 rounded-lg shadow-sm">
          {message.replyTo && (
            <div className="text-gray-500 text-sm italic mb-2">
              Replying to:{" "}
              {messages.find((msg) => msg.id === message.replyTo)?.content || "Message not found"}
            </div>
          )}
          <p className="text-gray-700">{message.content}</p>
          <button
            className="text-blue-500 text-sm mt-2 hover:underline"
            onClick={() => handleReply(message.id)}
          >
            <Reply className="h-4 w-4 text-green-800" />
          </button>
        </div>
      ))}
    </CardContent>
  )}

  {/* Message Input Field and Formatting Buttons */}
  {isOpen && (
    <CardFooter className="flex flex-col space-y-2 p-2">
      {/* Reply Preview */}
      {replyToMessageId && (
        <div className="flex items-center justify-between rounded-[10%] shadow-sm opacity-90 transition-opacity duration-300 p-2 mb-2 bg-green-100 text-sm text-green-800">
          <div className="text-sm italic text-gray-400 rounded-[10%] overflow-hidden whitespace-nowrap text-ellipsis max-w-full">
            <span className="font-semibold">Replying to: </span>
            {messages.find((msg) => msg.id === replyToMessageId)?.content || "Message not found"}
          </div>
          <Button
            className="ml-2 text-red-500 hover:text-red-700 rounded"
            onClick={() => setReplyToMessageId(null)}
          >
            <X className="ml-2 h-4 w-4 text-background" />
          </Button>
        </div>
      )}

      {/* Textarea and Formatting Buttons */}
      <Textarea
        ref={textAreaRef}
        className="w-full p-2 bg-white border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-green-800"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={2}
        placeholder="Type a message..."
      />

      <div className="flex space-x-2 mt-2 overflow-hidden">
        <Button
          className="text-foreground hover:text-foreground bg-primary-foreground border-none rounded-full"
          onClick={() => formatText("**")}
        >
          <Bold className="h-3 w-3" />
        </Button>
        <Button
          className="text-foreground hover:text-foreground bg-primary-foreground border-none rounded-full"
          onClick={() => formatText("*")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          className="text-foreground hover:text-foreground bg-primary-foreground border-none rounded-full"
          onClick={() => formatText("__")}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          className="text-foreground hover:text-foreground bg-primary-foreground border-none rounded-full py-2"
          onClick={sendMessage}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </CardFooter>
  )}
</Card>

  );
};

export default ChatComponent;