"use client";

import { useState, useEffect } from "react";
import { AlarmClock, Play, Pause, RotateCcw } from "lucide-react";

export default function Timer() {
  const [expanded, setExpanded] = useState(false);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (running) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [running]);

  const toggleTimer = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className="flex items-center space-x-2 border p-2 rounded-lg cursor-pointer"
      onClick={toggleTimer}
    >
      {/* Clock Icon - Click to Expand/Collapse Timer */}
      <AlarmClock className="w-5 h-5" />

      {/* Show Timer & Controls Only When Expanded */}
      {expanded && (
        <>
          {/* Play/Pause Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setRunning(!running);
            }}
          >
            {running ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>

          {/* Reset Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setTime(0);
            }}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Timer Display */}
          <p className="text-sm font-semibold w-16 text-center">
            {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
          </p>
        </>
      )}
    </div>
  );
}
