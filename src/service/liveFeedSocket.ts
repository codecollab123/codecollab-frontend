import { io, Socket } from "socket.io-client";

const FEED_SOCKET_URL = "http://localhost:4001"; // your feed socket backend

let feedSocket: Socket | null = null;

export const getFeedSocket = (userId?: string): Socket => {
  if (!feedSocket) {
    feedSocket = io(FEED_SOCKET_URL, {
      transports: ["websocket"],
      query: {
        userId: userId || "guest",
      },
      reconnectionAttempts: Infinity,
      timeout: 10000,
    });
  }
  return feedSocket;
};
