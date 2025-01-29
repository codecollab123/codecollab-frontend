"use client";

import { Pencil, Eraser, Type, Trash } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
// Import Lucide icons

const Whiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState<"pen" | "eraser" | "text">("pen");
  const [texts, setTexts] = useState<
    { x: number; y: number; text: string; isEditing: boolean }[]
  >([]);
  const [currentText, setCurrentText] = useState("");
  const [typingPosition, setTypingPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (tool === "text" && typingPosition) {
        if (e.key === "Enter") {
          setTexts((prev) => [
            ...prev,
            {
              x: typingPosition.x,
              y: typingPosition.y,
              text: currentText,
              isEditing: false,
            },
          ]);
          setTypingPosition(null);
          setCurrentText("");
          setIsTyping(false);
        } else if (e.key === "Backspace") {
          setCurrentText((prev) => prev.slice(0, -1));
        } else if (e.key.length === 1) {
          setCurrentText((prev) => prev + e.key);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [tool, typingPosition, currentText]);

  const startDrawing = (e: React.MouseEvent) => {
    if (tool !== "pen" && tool !== "eraser") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 10;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
    }

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (tool === "text") {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const canvasBounds = canvas.getBoundingClientRect();
      const x = e.clientX - canvasBounds.left;
      const y = e.clientY - canvasBounds.top;

      setTypingPosition({ x, y });
      setIsTyping(true);
      setCurrentText("");
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTexts([]);
  };

  const handleTextClick = (index: number) => {
    const updatedTexts = [...texts];
    updatedTexts[index].isEditing = true;
    setTexts(updatedTexts);
    setCurrentText(updatedTexts[index].text);
    setTypingPosition({ x: updatedTexts[index].x, y: updatedTexts[index].y });
    setIsTyping(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex gap-4 mb-3 items-center p-4 justify-center">
        <Button
          onClick={() => setTool("pen")}
          className="p-2 rounded-full hover:bg-gray-600"
        >
          <Pencil className="h-5 w-5 text-black" />
        </Button>
        <Button
          onClick={() => setTool("eraser")}
          className="p-2 rounded-full hover:bg-gray-600"
        >
          <Eraser className="h-5 w-5 text-black" />
        </Button>
        <Button
          onClick={() => setTool("text")}
          className="p-2 rounded-full hover:bg-gray-600"
        >
          <Type className="h-5 w-5 text-black" />
        </Button>
        <Button
          onClick={clearCanvas}
          className="p-2 rounded-full hover:bg-gray-600"
        >
          <Trash className="h-5 w-5 text-black" />
        </Button>
      </div>
      <div className="relative flex gap-4 items-center justify-center p-6 w-full">
        <canvas
          ref={canvasRef}
          width={1100}
          height={600}
          className="border rounded-2xl bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onClick={handleCanvasClick}
        />
        {texts.map((item, index) => (
          <span
            key={index}
            className={`absolute text-black cursor-pointer ${
              item.isEditing ? "border-b-2" : ""
            }`}
            style={{
              left: item.x,
              top: item.y,
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => handleTextClick(index)}
          >
            {item.text}
          </span>
        ))}
        {isTyping && typingPosition && (
          <span
            className="absolute text-black"
            style={{
              left: typingPosition.x,
              top: typingPosition.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            {currentText || "|"}
          </span>
        )}
      </div>
    </div>
  );
};

export default Whiteboard;
