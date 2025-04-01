"use client";

import React, { useState, useEffect, useRef } from "react";
import { axiosInstance } from "@/lib/axiosinstance"; 

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

    try {
      const response = await axiosInstance.post(CHAT_WITH_GEMINI, {
        message: input,
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

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 w-[350px] max-w-full p-4 rounded-lg backdrop-blur-lg bg-black/20 shadow-xl border border-gray-700">
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-xl text-gray-400 hover:text-white"
      >
        &times;
      </button>

      <h2 className="text-lg font-bold mb-3 ml-1 text-gray-300">Ask Anything</h2>

      {/* Chatbox */}
      <div className="h-72 overflow-y-auto bg-black/20 p-4 rounded-lg border border-gray-600">
        {messages.map((msg, index) => (
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
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input & Send Button */}
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