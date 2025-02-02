"use client";

import { Pencil, Eraser, Type, Trash } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";

const Whiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState<"pen" | "eraser" | "text">("pen");
  const [penColor, setPenColor] = useState("#000000"); // Default Black
  const [showColorPicker, setShowColorPicker] = useState(false);

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
      ctx.strokeStyle = penColor; 
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

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Toolbar */}
      <div className="flex gap-4 mb-3 items-center p-4 justify-center relative">
        {/* Pen Tool */}
        <div className="relative">
          <Button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded-full hover:bg-gray-600"
          >
            <Pencil className="h-5 w-5 text-black" />
          </Button>

          {/* Color Picker (Toggled on Click) */}
          {showColorPicker && (
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white shadow-lg p-2 rounded-lg flex gap-2">
              {["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFA500"].map(
                (color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setPenColor(color);
                      setShowColorPicker(false);
                    }}
                  />
                )
              )}
            </div>
          )}
        </div>

        {/* Eraser Tool */}
        <Button
          onClick={() => setTool("eraser")}
          className="p-2 rounded-full hover:bg-gray-600"
        >
          <Eraser className="h-5 w-5 text-black" />
        </Button>

        {/* Text Tool */}
        <Button
          onClick={() => setTool("text")}
          className="p-2 rounded-full hover:bg-gray-600"
        >
          <Type className="h-5 w-5 text-black" />
        </Button>

        {/* Clear Canvas */}
        <Button
          onClick={clearCanvas}
          className="p-2 rounded-full hover:bg-gray-600"
        >
          <Trash className="h-5 w-5 text-black" />
        </Button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={1100}
        height={600}
        className="border rounded-2xl bg-white"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
};

export default Whiteboard;
