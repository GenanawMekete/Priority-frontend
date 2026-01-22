import { io } from "socket.io-client";

export const socket = io("https://priority-backend-c5sb.onrender.com", {
  transports: ["websocket"]
});
