"use client";

import Header from "@/components/header/header";
import SidebarMenu from "@/components/menu/sidebarmenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlay, MessageSquareQuote, Search } from "lucide-react";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";
import { CircleX } from "lucide-react";
import { Music } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { TooltipContent } from "@/components/ui/tooltip";
import { axiosInstance } from '@/lib/axiosinstance';

interface studysoloProps {
  _id: string;
  userId: string;
  background: string;
  music: string;
  quote: string;
  todolist: string;
  video: string;
}

export default function SoloStudy({ user_id }: { user_id: string }) {
  const [time, setTime] = useState(50 * 60);
  const [user, setUser] = useState<studysoloProps>({
    _id: "",
    userId: "",
    background: "",
    music: "",
    quote: "",
    todolist: "",
    video: ""
  });
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isMusicOptionsVisible, setIsMusicOptionsVisible] = useState(false); // State for showing/hiding the music options
  const [selectedMusic, setSelectedMusic] = useState("/relaxmusic.mp3"); // State to track the selected music
  const [audio] = useState(new Audio(selectedMusic));
  const [isPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedBackground, setSelectedBackground] =
    useState("/studyroom5.mp4");
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const [isBackgroundOptionsVisible, setIsBackgroundOptionsVisible] =
    useState(false);
  const [youtubeLink, setYoutubeLink] = useState("");

  const [quote, setQuote] = useState("");
  const [savedQuotes, setSavedQuotes] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const backgroundOptions = [
    { name: "Ember Glow", url: "/studyroom1.mp4" },
    { name: "Serene Focus", url: "/studyroom2.mp4" },
    { name: "Whispering Woods", url: "/studyroom3.mp4" },
    { name: "Golden Spiral", url: "/studyroom4.mp4" },
    { name: "Scholarly Haven", url: "/studyroom5.mp4" },
    { name: "Caffeine Comfort", url: "/studyroom6.mp4" },
    { name: "Rainy Reverie", url: "/studyroom7.mp4" },
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
  const handleAddQuote = () => {
    if (quote.trim()) {
      setSavedQuotes((prevQuotes) => [...prevQuotes, quote]);
      setQuote("");
      setIsQuoteDialogOpen(false);
    }
  };
  useEffect(() => {
    const fetchStudyData = async () => {
      try {
        if (!user_id) return; // Agr user_id nahi h to API call mat kro
  
        const res = await axiosInstance.get(`/studysolo/${user_id}`);
        console.log("Fetching Study Solo for user_id:", user_id);

        const data: studysoloProps = res.data;
  
        setUser(data);
        setSelectedBackground(data.background);
        setSelectedMusic(data.music);
        setQuote(data.quote);
        setTasks(data.todolist ? data.todolist.split(",") : []);
      } catch (error) {
        console.error("Error fetching study data:", error);
      }
    };
  
    fetchStudyData();
  }, [user_id]); // ✅ Dependency ke andar `user_id` hi h jo prop se aa rha h
  
  const updateStudyData = async () => {
    try {
      if (!user_id || !user) return;// 🔹 ID check, bina ID ke API call mat kro
  
      const updatedData = {
        background: selectedBackground,
        music: selectedMusic,
        quote: quote,
        todolist: tasks.join(","), // 🔹 Array ko string me convert kar diya
        video: youtubeLink
      };
  
      await axiosInstance.put(`/studysolo/${user_id}`, updatedData);
      alert("Study Solo settings updated!");
    } catch (error) {
      console.error("Error updating study data:", error);
    }
  };
  // const resetStudyData = async () => {
  //   try {
  //     if (!user_id) return; // 🔹 ID check, bina ID ke API call mat kro
  
  //     const defaultData = {
  //       _id: user._id,
  //       userId: user.userId,
  //       background: "/studyroom5.mp4",
  //       music: "/relaxmusic.mp3",
  //       quote: "",
  //       todolist: "",
  //       video: ""
  //     };
  
  //     await axiosInstance.put(`/studysolo/${user_id}`, defaultData);
  //     setUser(defaultData);
  //     setSelectedBackground(defaultData.background);
  //     setSelectedMusic(defaultData.music);
  //     setQuote(defaultData.quote);
  //     setTasks([]);
  //     setYoutubeLink("");
  
  //     alert("Study Solo settings reset to default!");
  //   } catch (error) {
  //     console.error("Error resetting study data:", error);
  //   }
  // };
  
  
 

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/studysolo/${user_id}`);
        const data: studysoloProps = response.data;
        setUser(data);
        setSelectedBackground(data.background);
        setSelectedMusic(data.music);
        setQuote(data.quote);
        setTasks(data.todolist.split(','));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user_id]);

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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    onClick={toggleMusicOptions}
                    className="p-2 rounded-full bg-black/60 text-white"
                  >
                    {isPlaying ? <Music /> : <Music />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Music</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {isMusicOptionsVisible && (
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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    onClick={toggleBackgroundOptions}
                    className="p-2 rounded-full bg-black/60 text-white"
                  >
                    {isPlaying ? <ImagePlay /> : <ImagePlay />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>background</TooltipContent>
              </Tooltip>
            </TooltipProvider>

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
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    onClick={() => setIsDialogOpen(true)}
                    className="p-2 rounded-full bg-black/60 text-white"
                  >
                    <Search />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Search video</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsQuoteDialogOpen(true);
                    }}
                    className="p-2 rounded-full bg-black/60 text-white"
                  >
                    <MessageSquareQuote />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Motivational Quotes</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Dialog for entering a quote */}
            {isQuoteDialogOpen && (
              <Dialog
                open={isQuoteDialogOpen}
                onOpenChange={setIsQuoteDialogOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Enter Motivational Quote</DialogTitle>
                  </DialogHeader>
                  <Input
                    type="text"
                    placeholder="You are exceptional..."
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      onClick={() => {
                        setIsQuoteDialogOpen(false);
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
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
                </TooltipTrigger>
                <TooltipContent>Enlarge</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {isDialogOpen && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Paste YouTube Link</DialogTitle>
                  </DialogHeader>
                  <Input
                    type="text"
                    placeholder="Enter YouTube URL..."
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  />
                  {youtubeLink && (
                    <iframe
                      className="w-full h-60 mt-4"
                      src={`https://www.youtube.com/embed/${new URL(
                        youtubeLink
                      ).searchParams.get("v")}`}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  )}
                  <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                </DialogContent>
              </Dialog>
            )}
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
          {quote.trim() && (
            <div
              className="absolute z-10 text-white italic text-2xl font-bold text-center w-full px-4"
              style={{
                top: "40%",
                left: "80%",
                transform: "translate(-50%, -50%)",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
              }}
            >
              "{quote}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}