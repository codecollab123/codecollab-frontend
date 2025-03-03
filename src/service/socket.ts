import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

let socket: Socket | null = null; // ❇️ Store a single socket instance

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnectionAttempts: Infinity,

      timeout: 10000,
      transports: ["websocket"],
    });
  }
  return socket;
};
