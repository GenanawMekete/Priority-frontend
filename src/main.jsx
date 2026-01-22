import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { io } from "socket.io-client";
import "./styles.css";

// ================================
// Telegram WebApp Initialization
// ================================
const tg = window.Telegram.WebApp;
tg.expand(); // Expand WebApp for full height
tg.MainButton.hide(); // Hide main button by default

// ================================
// Socket.IO Multi-Room Setup
// ================================
const socket = io("https://priority-backend-c5sb.onrender.com", {
  transports: ["websocket"],
});

export { socket, tg };

// ================================
// User & Room State
// ================================
function Main() {
  const [user, setUser] = useState({
    telegramId: tg.initDataUnsafe.user.id,
    firstName: tg.initDataUnsafe.user.first_name,
    balance: 10, // Initial bonus balance
  });

  const [roomId, setRoomId] = useState("room1"); // Default room
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket.emit("join-room", { telegramId: user.telegramId, roomId });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    // Listen for balance updates from backend
    socket.on("update-balance", (newBalance) => {
      setUser((prev) => ({ ...prev, balance: newBalance }));
    });

    return () => {
      socket.emit("leave-room", { telegramId: user.telegramId, roomId });
      socket.off("update-balance");
    };
  }, [roomId]);

  return (
    <App user={user} roomId={roomId} connected={connected} />
  );
}

// ================================
// Render App
// ================================
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Main />);
