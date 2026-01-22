import React, { useState } from "react";
import Lobby from "./screens/Lobby";
import Game from "./screens/Game";
import { io } from "socket.io-client";

// Connect to backend Socket.IO
export const socket = io("https://priority-backend-c5sb.onrender.com"); // <-- Your Render backend URL

export default function App() {
  const [telegramId, setTelegramId] = useState(""); // e.g., from Telegram login
  const [inLobby, setInLobby] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [roomId, setRoomId] = useState("default-room"); // default room for now
  const [myCards, setMyCards] = useState([]);

  // Step 1: Telegram ID login
  const handleLogin = (id) => {
    if (!id) return;
    setTelegramId(id);
    setInLobby(true);
  };

  // Step 2: Lobby finished → start game
  const handleGameStart = (room, cards) => {
    setRoomId(room);
    setMyCards(cards);
    setInLobby(false);
    setInGame(true);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      {!telegramId && (
        <div>
          <h2>Enter your Telegram ID to Join Bingo</h2>
          <input
            type="text"
            placeholder="Telegram ID"
            onChange={(e) => setTelegramId(e.target.value)}
            value={telegramId}
            style={{ padding: "8px", fontSize: "16px", width: "250px" }}
          />
          <button
            onClick={() => handleLogin(telegramId)}
            style={{
              padding: "10px 20px",
              marginLeft: "12px",
              fontWeight: "bold",
              background: "#28c76f",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Join
          </button>
        </div>
      )}

      {inLobby && telegramId && (
        <Lobby telegramId={telegramId} onGameStart={handleGameStart} />
      )}

      {inGame && (
        <Game telegramId={telegramId} roomId={roomId} myCards={myCards} />
      )}
    </div>
  );
}
