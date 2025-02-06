import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    'force new connection': true,
    reconnectionAttempt: 'Infinity',
    timeout: 10000,
    transports: ['websocket'],
  };
  return io('http://127.0.0.1:5000/', options);
};
