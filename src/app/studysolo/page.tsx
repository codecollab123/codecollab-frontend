"use client";

import Header from "@/components/header/header";
import SidebarMenu from "@/components/menu/sidebarmenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ImagePlay } from "lucide-react";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import { Maximize2 } from "lucide-react";
import { CircleX } from "lucide-react";
import { Music } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function SoloStudy() {
  const [time, setTime] = useState(50 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isMusicOptionsVisible, setIsMusicOptionsVisible] = useState(false); // State for showing/hiding the music options
  const [selectedMusic, setSelectedMusic] = useState("/relaxmusic.mp3"); // State to track the selected music
  const [audio] = useState(new Audio(selectedMusic));
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedBackground, setSelectedBackground] =
    useState("/studyroom5.mp4");
    const fullscreenRef = useRef<HTMLDivElement>(null);
    const [isBackgroundOptionsVisible, setIsBackgroundOptionsVisible] = useState(false);
  const backgroundOptions = [
    { name: "Firewood", url: "/studyroom1.mp4" },
    { name: "Focus", url: "/studyroom2.mp4" },
    { name: "Nature", url: "/studyroom3.mp4" },
    { name: "Spiral", url: "/studyroom4.mp4" },
    { name: "Study", url: "/studyroom5.mp4" },
    { name: "Coffee", url: "/studyroom6.mp4" },
  ];
  const musicOptions = [
    { name: "Rainfall", url: "/rainfall.mp3" },
    { name: "Study Beats", url: "/relaxmusic.mp3" },
    { name: "Nature Wood", url: "/nature.mp3" },
    { name: "Joy Music", url: "/takemehome.mp3" },
  ];
  const toggleBackgroundOptions = () => {
    setIsBackgroundOptionsVisible(!isBackgroundOptionsVisible);
  };

  // Function to handle background selection
  const handleBackgroundSelection = (url: string) => {
    setSelectedBackground(url);
    setIsBackgroundOptionsVisible(false); // Close the options after selection
  };
  const toggleMusicOptions = () => {
    setIsMusicOptionsVisible(!isMusicOptionsVisible);
  };
  const handleMusicSelection = (url: string) => {
    setSelectedMusic(url);
    audio.src = url;
    audio.play(); 
    setIsMusicOptionsVisible(false); 
  };
  
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div ref={fullscreenRef} className="flex min-h-screen w-full bg-muted/40">
      {!isFullscreen && (
        <SidebarMenu
          menuItemsTop={menuItemsTop}
          menuItemsBottom={menuItemsBottom}
          active=""
        />
      )}
      <div className="flex flex-col flex-1 min-h-screen w-full">
        {!isFullscreen && (
          <Header
            menuItemsTop={menuItemsTop}
            menuItemsBottom={menuItemsBottom}
            activeMenu="Projects"
            breadcrumbItems={[
              { label: "dashboard", link: "/dashboard" },
              { label: "Study Room", link: "/dashboard/studyroom" },
            ]}
          />
        )}

        <div className="relative w-full flex-1 flex flex-col items-center justify-center">
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={selectedBackground}
            autoPlay
            loop
            muted
          />

          <div
            className="absolute z-10 bg-black/50 p-6 rounded-lg text-white "
            style={{ left: "80px", top: "10px", position: "absolute" }}
          >
            <h1 className="text-2xl font-bold mb-4">Solo Study Mode</h1>
            <h2 className="text-xl">{formatTime(time)}</h2>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button onClick={() => setTime(50 * 60)}>Reset</Button>
            </div>
          </div>

          <div className="absolute top-4 right-4 flex gap-4 z-20">
            <Button
              variant="ghost"
              onClick={toggleMusicOptions}
              className="p-2 rounded-full bg-black/60 text-white"
            >
              {isPlaying ? <Music /> : <Music />}
            </Button> {isMusicOptionsVisible && (
          <div className="absolute right-0 p-2 mt-9 mr-5 w-full rounded-2xl bg-black shadow-md">
            <ul>
              {musicOptions.map((music, index) => (
                <li
                  key={index}
                  className="cursor-pointer p-2 rounded-lg hover:bg-gray-800"
                  onClick={() => handleMusicSelection(music.url)}
                >
                  {music.name}
                </li>
              ))}
            </ul>
          </div>
        )}
            <Button
              variant="ghost"
              onClick={toggleBackgroundOptions}
              className="p-2 rounded-full bg-black/60 text-white"
            >
              {isPlaying ? <ImagePlay /> : <ImagePlay />}
            </Button>

          {isBackgroundOptionsVisible && (
            <div className="absolute right-0 p-2 mt-9 w-48 rounded-lg bg-black shadow-md">
              <ul>
                {backgroundOptions.map((bg, index) => (
                  <li
                    key={index}
                    className="cursor-pointer rounded-lg p-2 hover:bg-gray-800"
                    onClick={() => handleBackgroundSelection(bg.url)} 
                  >
                    {bg.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
            <Button
              variant="ghost"
              onClick={() => {
                if (!document.fullscreenElement) {
                  fullscreenRef.current?.requestFullscreen();
                  setIsFullscreen(true);
                } else {
                  document.exitFullscreen();
                  setIsFullscreen(false);
                }
              }}
              className="p-2 rounded-full bg-black/60 text-white"
            >
              {isFullscreen ? <Maximize2 /> : <Maximize2 />}
            </Button>
          </div>

          <div
            className="absolute z-10 bg-black/50 p-6 rounded-lg text-white"
            style={{ left: "80px", top: "calc(20px + 170px)" }}
          >
            <h3 className="text-lg font-semibold">To-Do List</h3>
            <div className="flex gap-2 mt-2">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a task..."
              />
              <Button onClick={() => setTasks([...tasks, newTask])}>Add</Button>
            </div>
            <ul className="mt-2">
              {tasks.map((task, index) => (
                <li key={index} className="flex justify-between">
                  {task}
                  <Button
                    className="bg bg-red-400 mb-2 h-6 w-4"
                    onClick={() =>
                      setTasks(tasks.filter((_, i) => i !== index))
                    }
                  >
                    <CircleX />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
