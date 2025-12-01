"use client";

import {
  MoreHorizontal,
  Play,
  Menu,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  UserPlus,
  Link as Linking,
  ChevronDown,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useParams } from "next/navigation";
import { Socket } from "socket.io-client";
import { useSelector } from "react-redux";

import Header from "@/components/header/header";
import SidebarMenu from "@/components/menu/sidebarmenu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import { Input } from "@/components/ui/input";
import { getSocket } from "@/service/socket";
import { axiosInstance } from "@/lib/axiosinstance";
import { toast } from "@/components/ui/use-toast";
import { RootState } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Chatbot from "@/components/chatBot";
import Whiteboard from "@/components/whiteboard/page";

export default function CodingRoom() {
  const user = useSelector((state: RootState) => state.user);
  const { room_id } = useParams<{ room_id: string }>();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { userName: string; message: string; isCurrentUser: boolean }[]
  >([]);
  const [queuedCodeChanges, setQueuedCodeChanges] = useState<
    string | undefined
  >(undefined); // Queue for code changes
  const [outputText, setOutputText] = useState("");
  // const [inputText, setInputText] = useState("");
  const languages = ["c", "cpp", "java", "python", "javascript", "go", "rust"];
  const socketRef = useRef<Socket | null>(null);
  const [users, setUsers] = useState<{ socketId: string; userName: string }[]>(
    [],
  );
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const isLocalChange = useRef(false); // Flag to track local changes
  const codeRef = useRef<string | undefined>(undefined);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isListening, setIsListening] = useState(true);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [activeSpeakers, setActiveSpeakers] = useState<string[]>([]);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [showAI, setShowAI] = useState(false);
  // Setup voice activity detection
  const setupVoiceActivityDetection = (stream: MediaStream) => {
    if (!stream) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);

    let speaking = false;
    let speakingTimer: NodeJS.Timeout | null = null;

    scriptProcessor.onaudioprocess = function () {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);

      // Calculate average volume
      let average = 0;
      const length = array.length;
      for (let i = 0; i < length; i++) {
        average += array[i];
      }
      average = average / length;

      // Detect speaking activity
      if (average > 20 && !speaking) {
        speaking = true;
        socketRef.current?.emit("voice_activity", {
          room_id,
          speaking: true,
        });

        // Clear any existing timer
        if (speakingTimer) {
          clearTimeout(speakingTimer);
          speakingTimer = null;
        }
      } else if (average <= 20 && speaking) {
        // Use a timer to prevent rapid on/off for brief pauses
        if (!speakingTimer) {
          speakingTimer = setTimeout(() => {
            speaking = false;
            socketRef.current?.emit("voice_activity", {
              room_id,
              speaking: false,
            });
            speakingTimer = null;
          }, 1000);
        }
      }
    };

    return () => {
      microphone.disconnect();
      analyser.disconnect();
      scriptProcessor.disconnect();
      if (speakingTimer) {
        clearTimeout(speakingTimer);
      }
    };
  };

  // Handle microphone toggle
  const toggleMicrophone = async () => {
    try {
      if (!audioStream) {
        // Start streaming audio
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioStreamRef.current = stream;
        setAudioStream(stream);
        setIsMuted(false);

        // Setup voice activity detection
        setupVoiceActivityDetection(stream);

        // Broadcast to room that this user is now streaming audio
        socketRef.current?.emit("audio_capabilities", {
          room_id,
          hasAudio: true,
        });

        // Create connections with all existing users
        users.forEach((user) => {
          if (user.socketId !== socketRef.current?.id) {
            initiateWebRTCConnection(user.socketId);
          }
        });
      } else {
        if (isMuted) {
          // Unmute existing stream
          audioStream.getAudioTracks().forEach((track) => {
            track.enabled = true;
          });
          setIsMuted(false);
          socketRef.current?.emit("audio_unmute", { room_id });
        } else {
          // Mute existing stream
          audioStream.getAudioTracks().forEach((track) => {
            track.enabled = false;
          });
          setIsMuted(true);
          socketRef.current?.emit("audio_mute", { room_id });
        }
      }
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description:
          "Could not access your microphone. Please check permissions.",
      });
    }
  };

  // Handle listening toggle
  const toggleListening = () => {
    setIsListening(!isListening);

    // Mute/unmute all audio elements
    audioElementsRef.current.forEach((audioEl) => {
      audioEl.muted = !isListening;
    });
  };

  // Create WebRTC peer connection
  const createPeerConnection = (socketId: string) => {
    // Create a new RTCPeerConnection
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // Store the connection
    peerConnectionsRef.current.set(socketId, peerConnection);

    // Add local audio tracks to the connection
    if (audioStreamRef.current) {
      audioStreamRef.current.getAudioTracks().forEach((track) => {
        peerConnection.addTrack(track, audioStreamRef.current!);
      });
    }

    // Handle incoming remote stream
    peerConnection.ontrack = (event) => {
      if (!audioElementsRef.current.has(socketId)) {
        const audioEl = new Audio();
        audioEl.autoplay = true;
        audioEl.muted = !isListening;
        audioEl.srcObject = event.streams[0];
        audioElementsRef.current.set(socketId, audioEl);

        // Update active speakers
        setActiveSpeakers((prev) => {
          const userName =
            users.find((u) => u.socketId === socketId)?.userName || "Unknown";
          if (!prev.includes(userName)) {
            return [...prev, userName];
          }
          return prev;
        });
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("ice_candidate", {
          room_id,
          candidate: event.candidate,
          to: socketId,
        });
      }
    };

    return peerConnection;
  };

  // Send chat message
  const sendChatMessage = () => {
    if (!message.trim()) return;

    const messageData = {
      text: message,
      userName: user?.displayName || "Guest",
      userId: user?.uid || "unknown", // Include userId to identify sender
      timestamp: new Date().toISOString(),
    };

    // Add message to local state
    setChatMessages((prev) => [
      ...prev,
      {
        userName: messageData.userName.charAt(0) || "U",
        message: messageData.text,
        isCurrentUser: true,
      },
    ]);

    // Send message to others (not to self)
    socketRef.current?.emit("send_message", {
      room_id,
      message: messageData,
    });

    setMessage("");
  };

  // Run code
  const runCode = async () => {
    if (!editorRef.current) return;

    const code = editorRef.current.getValue();

    setOutputText("⏳ Running code...");

    try {
      const res = await axiosInstance.post("/code/run", {
        code,
        language: selectedLanguage,
      });

      setOutputText(res.data.result.output);
    } catch (err) {
      setOutputText("❌ Failed to execute code");
    }
  };

  // Add this helper function to determine who initiates the connection
  const shouldInitiateConnection = (remoteSocketId: string): boolean => {
    // Compare socket IDs lexicographically to ensure consistent behavior
    // The peer with the "smaller" ID initiates the connection
    return (socketRef.current?.id || "") < remoteSocketId;
  };

  const initiateWebRTCConnection = (socketId: string): void => {
    // Don't create duplicate connections
    if (peerConnectionsRef.current.has(socketId)) {
      return;
    }

    // Create peer connection
    const peerConnection = createPeerConnection(socketId);

    peerConnection.onnegotiationneeded = (event) => {
      // Only create an offer if this client should be the initiator
      if (shouldInitiateConnection(socketId)) {
        peerConnection
          .createOffer()
          .then((offer) => {
            return peerConnection.setLocalDescription(offer);
          })
          .then(() => {
            // Add null check here too
            if (socketRef.current) {
              socketRef.current.emit("webrtc_offer", {
                room_id,
                offer: peerConnection.localDescription,
                to: socketId,
              });
            } else {
              console.error("Socket connection not established");
            }
          })
          .catch((err) => {
            console.error("Error during negotiation:", err);
          });
      }
    };
    // Otherwise, just create the connection and wait for an offer
  };

  // Initialize socket connection
  useEffect(() => {
    const init = async () => {
      if (socketRef.current) return; // Prevent multiple connections

      // Try to get audio permission early
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioStreamRef.current = stream;
        setAudioStream(stream);

        // Initially muted
        stream.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });
        setIsMuted(true);

        // Setup voice activity detection
        setupVoiceActivityDetection(stream);
      } catch (error) {
        console.log("Audio not initially available:", error);
        // This is not a critical error, just means no audio yet
      }

      // Now connect to socket
      socketRef.current = await getSocket();

      // Emit 'join' event with logged-in user details and audio status
      socketRef.current.emit("join", {
        room_id,
        userName: user?.displayName || "Guest",
        userId: user?.uid || "unknown",
        hasAudio: audioStreamRef.current !== null,
      });

      // Listen for new user joining
      socketRef.current.on(
        "user_joined",
        ({ clients, userName, socketId, hasAudio }) => {
          setUsers(clients);

          toast({
            title: "User Joined",
            description: `${userName} joined the room`,
          });

          // Sync code with new user
          if (socketRef.current) {
            socketRef.current.emit("code_sync", {
              code: codeRef.current,
              socketId,
            });
          }

          // If the new user has audio capabilities and we have audio stream
          // Create a peer connection (but let the negotiation logic decide who makes the offer)
          if (hasAudio && audioStreamRef.current) {
            initiateWebRTCConnection(socketId);
          }
        },
      );

      // Listen for audio capability announcement
      socketRef.current.on(
        "audio_capabilities",
        ({ socketId, userName, hasAudio }) => {
          if (hasAudio && audioStreamRef.current) {
            // Create peer connection if remote user is audio capable and we are too
            initiateWebRTCConnection(socketId);
          }
        },
      );

      // Listen for audio capability announcement
      socketRef.current.on(
        "audio_capabilities",
        ({ socketId, userName, hasAudio }) => {
          if (hasAudio && audioStreamRef.current) {
            // Create peer connection if remote user is audio capable and we are too
            initiateWebRTCConnection(socketId);
          }
        },
      );

      // Rest of your existing socket event listeners...
      socketRef.current.on("code_change", ({ newCode }) => {
        if (!isLocalChange.current) {
          if (editorRef.current) {
            editorRef.current.setValue(newCode);
          } else if (newCode !== undefined) {
            setQueuedCodeChanges(newCode);
          }
        }
      });

      socketRef.current.on("receive_message", (receivedMessage) => {
        if (receivedMessage.userId !== user?.uid) {
          setChatMessages((prev) => [
            ...prev,
            {
              userName: receivedMessage.userName.charAt(0) || "U",
              message: receivedMessage.text,
              isCurrentUser: false,
            },
          ]);
        }
      });

      socketRef.current.on("webrtc_offer", async ({ offer, socketId }) => {
        // Create peer connection if it doesn't exist
        let peerConnection = peerConnectionsRef.current.get(socketId);
        if (!peerConnection) {
          peerConnection = createPeerConnection(socketId);
        }

        // Set the remote description (the offer)
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(offer),
        );

        // Create and send answer
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        socketRef.current?.emit("webrtc_answer", {
          room_id,
          answer,
          to: socketId,
        });
      });

      socketRef.current.on("webrtc_answer", async ({ answer, socketId }) => {
        const peerConnection = peerConnectionsRef.current.get(socketId);
        if (peerConnection) {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(answer),
          );
        }
      });

      socketRef.current.on("ice_candidate", async ({ candidate, socketId }) => {
        const peerConnection = peerConnectionsRef.current.get(socketId);
        if (peerConnection) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      socketRef.current.on("audio_mute", ({ socketId, userName }) => {
        toast({
          title: "Voice Chat",
          description: `${userName} muted their microphone`,
        });
      });

      socketRef.current.on("audio_unmute", ({ socketId, userName }) => {
        toast({
          title: "Voice Chat",
          description: `${userName} unmuted their microphone`,
        });
      });

      socketRef.current.on(
        "voice_activity",
        ({ socketId, speaking, userName }) => {
          const user = users.find((u) => u.socketId === socketId);
          if (user) {
            setActiveSpeakers((prev) => {
              if (speaking && !prev.includes(user.userName)) {
                return [...prev, user.userName];
              } else if (!speaking) {
                return prev.filter((name) => name !== user.userName);
              }
              return prev;
            });
          }
        },
      );

      socketRef.current.on("disconnected", ({ socketId, userName }) => {
        toast({
          variant: "destructive",
          title: "User Disconnected",
          description: `User ${userName} left the room`,
        });

        setUsers((prev) =>
          prev.filter((client) => client.socketId !== socketId),
        );

        // Remove from active speakers
        setActiveSpeakers((prev) => prev.filter((name) => name !== userName));

        // Clean up audio connections
        const audioEl = audioElementsRef.current.get(socketId);
        if (audioEl) {
          audioEl.pause();
          audioEl.srcObject = null;
          audioElementsRef.current.delete(socketId);
        }

        const peerConnection = peerConnectionsRef.current.get(socketId);
        if (peerConnection) {
          peerConnection.close();
          peerConnectionsRef.current.delete(socketId);
        }
      });

      // Handle socket errors
      socketRef.current.on("connect_error", (err) =>
        console.error("Socket error:", err),
      );
      socketRef.current.on("connect_failed", (err) =>
        console.error("Socket connection failed:", err),
      );
    };

    init();

    return () => {
      // Clean up resources when component unmounts
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Close all peer connections
      peerConnectionsRef.current.forEach((connection) => {
        connection.close();
      });

      // Clear audio elements
      audioElementsRef.current.forEach((audioEl) => {
        audioEl.pause();
        audioEl.srcObject = null;
      });

      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [room_id]);

  // Scroll to bottom of chat when new messages come in
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Send invitation to join the room
  const sendInvite = async () => {
    const inviteLink = `${window.location.origin}/join-room/${room_id}`;

    try {
      const response = await axiosInstance.post("/api/invite", {
        email: inviteEmail,
        room_id,
        inviteLink,
      });

      if (response.status === 200) {
        toast({
          title: "Invitation Sent",
          description: `Invitation sent to: ${inviteEmail}`,
        });
        setInviteOpen(false);
        setInviteEmail("");
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      toast({
        variant: "destructive",
        title: "Failed to Send Invite",
        description: "Please try again later.",
      });
    }
  };

  // Handle editor changes
  const handleEditorChange = (code: string | undefined) => {
    if (code !== undefined) {
      if (socketRef.current && isLocalChange.current) {
        socketRef.current.emit("code_change", {
          roomId: room_id,
          newCode: code,
        });
        codeRef.current = code;
      }
    }
  };

  // Handle editor mount
  const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    // Apply any queued code changes
    if (queuedCodeChanges !== undefined) {
      editorRef.current.setValue(queuedCodeChanges);
      setQueuedCodeChanges(undefined);
    }

    editor.onDidChangeModelContent(() => {
      isLocalChange.current = true;
      setTimeout(() => {
        isLocalChange.current = false;
      }, 100);
    });
  };

  // Handle input for chat messages
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <SidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active=""
      />
      <div className="flex flex-col flex-1 min-h-screen w-full">
        <Header
          menuItemsTop={menuItemsTop}
          menuItemsBottom={menuItemsBottom}
          activeMenu="Projects"
          breadcrumbItems={[
            { label: "dashboard", link: "/dashboard" },
            { label: "Coding Room", link: "/dashboard/codingroom" },
          ]}
        />

        <main className="flex flex-1 flex-col ml-[55px] sm:py-0">
          <div className="flex flex-col h-screen bg-black text-white">
            <div className="flex flex-1 mx-4 mb-4 rounded-lg overflow-hidden border border-gray-800">
              <div className="flex-1 flex flex-col bg-zinc-900">
                <div className="flex items-center justify-between p-2 border-b border-gray-800">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      className="text-gray-400 h-9 w-9 p-0"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-gray-400 ml-2 px-3"
                        >
                          {selectedLanguage}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {languages.map((lang) => (
                          <DropdownMenuItem
                            key={lang}
                            onClick={() => setSelectedLanguage(lang)}
                            className="cursor-pointer hover:bg-zinc-700"
                          >
                            {lang}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      className="text-gray-400 h-9 w-9 p-0"
                      onClick={toggleMicrophone}
                      title={isMuted ? "Unmute microphone" : "Mute microphone"}
                    >
                      {isMuted ? (
                        <MicOff className="h-5 w-5" />
                      ) : (
                        <Mic className="h-5 w-5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-gray-400 h-9 w-9 p-0"
                      onClick={toggleListening}
                      title={isListening ? "Mute others" : "Unmute others"}
                    >
                      {isListening ? (
                        <Volume2 className="h-5 w-5" />
                      ) : (
                        <VolumeX className="h-5 w-5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-gray-400 h-9 w-9 p-0"
                      onClick={runCode}
                    >
                      <Play className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-gray-400 h-9 w-9 p-0"
                      onClick={() => setInviteOpen(true)}
                    >
                      <UserPlus className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-gray-400 h-9 w-9 p-0"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-1">
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 p-4 border-b border-gray-800">
                      <div className="flex justify-between mb-2">
                        <h3 className="text-gray-400">Input</h3>
                      </div>
                      <div className="h-[calc(100%-30px)] rounded-md relative">
                        <Editor
                          height="580px"
                          width="100%"
                          language={selectedLanguage}
                          defaultValue="// Start coding here"
                          theme="vs-dark"
                          onChange={handleEditorChange}
                          onMount={handleEditorMount}
                          options={{
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                          }}
                        />
                      </div>
                    </div>

                    <div className="h-1/3 p-4">
                      <h3 className="text-gray-400 mb-2">Output</h3>
                      <div className="h-[calc(100%-30px)] bg-zinc-800 rounded-md p-2 overflow-auto font-mono text-sm">
                        {outputText || "Output will appear here..."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-56 bg-zinc-900 border-l border-gray-800">
                <div className="p-4">
                  <h2 className="text-sm font-medium mb-2">
                    Joined members ({users.length})
                  </h2>
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div
                        key={user.socketId}
                        className="flex items-center gap-2"
                      >
                        <Avatar>
                          <AvatarFallback className="bg-rose-500 text-xs h-6 w-6">
                            {user.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate">
                          {user.userName}
                        </span>
                        {activeSpeakers.includes(user.userName) && (
                          <Volume2 className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                    ))}
                    {users.length === 0 && (
                      <span className="text-sm text-gray-400">
                        No users yet
                      </span>
                    )}
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                <div className="p-4">
                  <h2 className="text-sm font-medium mb-2">Languages</h2>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => (
                      <span
                        key={lang}
                        className={`px-2 py-1 text-xs rounded-md cursor-pointer ${
                          selectedLanguage === lang
                            ? "bg-green-700"
                            : "bg-zinc-800 hover:bg-zinc-700"
                        }`}
                        onClick={() => setSelectedLanguage(lang)}
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="text-sm font-medium mb-2">Live Chat</h2>
                  <div
                    ref={chatContainerRef}
                    className="flex-1 space-y-3 mb-3 overflow-y-auto max-h-[200px] pr-1"
                  >
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-2 ${
                          msg.isCurrentUser ? "justify-end" : ""
                        }`}
                      >
                        {!msg.isCurrentUser && (
                          <div className="h-6 w-6 rounded-full bg-rose-500 flex items-center justify-center text-xs mt-0.5">
                            {msg.userName}
                          </div>
                        )}
                        <div
                          className={`${
                            msg.isCurrentUser ? "bg-green-900" : "bg-zinc-800"
                          } px-3 py-1.5 rounded-lg text-sm max-w-[80%]`}
                        >
                          {msg.message}
                        </div>
                        {msg.isCurrentUser && (
                          <div className="h-6 w-6 rounded-full bg-gray-500 flex items-center justify-center text-xs mt-0.5">
                            {msg.userName}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="relative mb-2">
                    <input
                      className="w-full bg-zinc-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600"
                      placeholder="Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm"
                      onClick={sendChatMessage}
                    >
                      Send
                    </button>
                    <Dialog>
                      {/* Button to Open Dialog */}
                      <DialogTrigger asChild>
                        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm">
                          White Board
                        </button>
                      </DialogTrigger>

                      {/* Whiteboard Modal/Dialog */}
                      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
                        {/* Required Title for Accessibility */}
                        <DialogTitle className="sr-only">
                          Whiteboard
                        </DialogTitle>

                        {/* Whiteboard Component */}
                        <Whiteboard room_id={room_id} />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div>
                    <button
                      className="w-full mt-3 text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all px-4 py-2 rounded-md"
                      onClick={() => setShowAI(!showAI)}
                    >
                      AI CodeMate
                    </button>

                    {showAI && <Chatbot />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Invite Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="bg-zinc-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Invite Someone</DialogTitle>
          </DialogHeader>
          <Input
            type="email"
            placeholder="Enter email or name..."
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="bg-zinc-800 border-gray-700 focus:border-gray-600"
          />
          <div className="flex items-center gap-2 text-gray-400">
            <Linking className="h-4 w-4" />
            <span>Private Link</span>
          </div>
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={sendInvite}
          >
            Send Invite
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
