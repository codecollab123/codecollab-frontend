import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, X, Reply, MessageSquare } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";


const socket = io("http://localhost:5000");

type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  replyTo?: string | null;
};

const ChatComponent: React.FC = () => {
  const user = useSelector((state: any) => state.user);
  const userName = user?.userName || "User";
  const userId = user?.uid || "Guest";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [replyToMessageId, setReplyToMessageId] = useState<string | null>(null);
  const { room_id } = useParams<{ room_id: string }>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (!room_id) return;
    socket.connect();
    setMessages([]);
    socket.emit("join", { room_id, userName });

    socket.on("load_old_messages", (oldMessages: Message[]) => {
      setMessages(oldMessages);
    });

    socket.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [room_id, userName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: userId,
      content: input,
      timestamp: new Date().toISOString(),
      replyTo: replyToMessageId || null,
    };

    socket.emit("send_message", { room_id, message: newMessage });
    setInput("");
    setReplyToMessageId(null);
  };

  return (
    <div>
      <Button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed  right-4  text-background p-3  shadow-lg"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      {isChatOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 120 }}
          className="fixed   right-0 h-full w-96  shadow-lg flex flex-col border-l"
        >
          <Card className="flex flex-col h-[90%]">
            <CardHeader className="flex  bg-gray-100 p-1 border-b">
              <div className="flex items-end space-x-3 left-0">
                <Avatar>
                  <AvatarImage src="https://randomuser.me/api/portraits/women/1.jpg" alt="Profile Image" />
                  <AvatarFallback>{userName}</AvatarFallback>
                </Avatar>
                <p className="text-lg font-semibold text-gray-800">{userName}</p>
              </div>
              <Button className="flex items-start justify-end"variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
                <X className="h-5 w-5 text-gray-600" />
              </Button>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-2 rounded-lg max-w-[75%] ${message.senderId === userId ? " bg-green-100  ml-auto text-black" : "bg-gray-200 text-black"}`}
                >
                  {message.replyTo && (
                    <div className="text-gray-500 text-sm italic mb-1">
                      Replying to: {messages.find((msg) => msg.id === message.replyTo)?.content || "Message not found"}
                    </div>
                  )}
                  <p>{message.content}</p>
                 
                  
                    <Reply  onClick={() => setReplyToMessageId(message.id)} className="cursor-pointer h-4 w-4 text-green-800 right-3" />
               
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>

            <CardFooter className="p-4 border-t bg-gray-100 flex flex-col space-y-2">
              {replyToMessageId && (
                <div className="flex items-center justify-between p-2 bg-green-100 text-gray-500 text-sm">
                  <span className="font-semibold">Replying to:</span>{" "}
                  {messages.find((msg) => msg.id === replyToMessageId)?.content || "Message not found"}
               
                    <X onClick={() => setReplyToMessageId(null)} className="h-4 w-4 text-red-500" />
                 
                </div>
              )}
              <Textarea
                className="flex-1 resize-none border rounded-lg p-2 text-black"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder="Type a message..."
              />
              <Button onClick={sendMessage} className=" text-white p-2 rounded-lg">
                <Send className="h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ChatComponent;
