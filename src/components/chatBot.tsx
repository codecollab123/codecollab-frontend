"use client";

import React, { useState, useEffect, useRef } from "react";
import { axiosInstance } from "@/lib/axiosinstance";
import { Clipboard } from "lucide-react";

const CHAT_WITH_GEMINI = "/chat";

const Chatbot = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const history = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    try {
      const response = await axiosInstance.post(CHAT_WITH_GEMINI, {
        message: input,
        history,
      });

      if (response?.data?.data) {
        setMessages([
          ...newMessages,
          { role: "bot", content: response.data.data.reply },
        ]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { role: "bot", content: "An error occurred, please try again." }]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderMessage = (msg: { role: string; content: string }, index: number) => {
    const codeMatch = msg.content.match(/```([\s\S]+?)```/);
    
    if (codeMatch) {
      return (
        <div key={index} className="bg-gray-900 text-white p-3 my-2 rounded-lg relative">
          <button
            onClick={() => copyToClipboard(codeMatch[1])}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <Clipboard size={18} />
          </button>
          <pre className="overflow-x-auto p-2 rounded-md">
            <code>{codeMatch[1]}</code>
          </pre>
        </div>
      );
    }
    
    return (
      <div
        key={index}
        className={`p-3 my-2 w-fit max-w-xs rounded-lg text-sm shadow-md ${
          msg.role === "user"
            ? "ml-auto bg-green-500 text-white"
            : "mr-auto bg-gray-300 text-black"
        }`}
      >
        {msg.content}
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 w-[350px] max-w-full p-4 rounded-lg backdrop-blur-lg bg-black/20 shadow-xl border border-gray-700">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-xl text-gray-400 hover:text-white"
      >
        &times;
      </button>

      <h2 className="text-lg font-bold mb-3 ml-1 text-gray-300">Ask Anything</h2>

      <div className="h-72 overflow-y-auto bg-black/20 p-4 rounded-lg border border-gray-600">
        {messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-md bg-black/40 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
          onClick={sendMessage}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
