import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import BingoBoard from "../components/BingoBoard";
import PlayerCard from "../components/PlayerCard";

export default function Game({ telegramId, roomId = "default", onFinish }) {
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [myCards, setMyCards] = useState([]); // Array of { number, content }
  const [winners, setWinners] = useState([]);
  const [gameStatus, setGameStatus] = useState("WAITING"); // WAITING | RUNNING | FINISHED

  // ===========================
  // Connect to socket
  // ===========================
  useEffect(() => {
    // Join room
    socket.emit("join-game", { telegramId, roomId });

    // Listen for card assignment
    socket.on("card-assigned", ({ number, content }) => {
      setMyCards((prev) => {
        // Only add if this card belongs to this player
        if (prev.find((c) => c.number === number)) return prev;
        return [...prev, { number, content }];
      });
    });

    // Listen for called numbers
    socket.on("number-called", (n) => {
      setCalledNumbers((prev) => [...prev, n]);
    });

    // Listen for game won
    socket.on("game-won", ({ winners: winnerList }) => {
      setWinners(winnerList);
      setGameStatus("FINISHED");
    });

    // Reset for new round
    socket.on("new-round", () => {
      setCalledNumbers([]);
      setMyCards([]);
      setWinners([]);
      setGameStatus("WAITING");
    });

    return () => {
      socket.off("card-assigned");
      socket.off("number-called");
      socket.off("game-won");
      socket.off("new-round");
    };
  }, []);

  // ===========================
  // Press BINGO handler
  // ===========================
  const handleBingo = () => {
    if (gameStatus !== "RUNNING") return;
    socket.emit("press-bingo", { telegramId, roomId });
  };

  // ===========================
  // Start draw (for demo/admin)
  // ===========================
  const startDraw = () => {
    socket.emit("start-draw", { roomId });
    setGameStatus("RUNNING");
  };

  return (
    <div style={{ padding: "12px" }}>
      <h2>Bingo Game</h2>
      <p>Status: {gameStatus}</p>

      {/* Called Numbers Panel */}
      <div style={{ marginBottom: "20px" }}>
        <h4>Numbers Called:</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 1fr)",
            gap: "4px",
            maxHeight: "120px",
            overflowY: "auto",
            border: "1px solid #444",
            padding: "6px",
            borderRadius: "6px",
            backgroundColor: "#1a0f2e",
          }}
        >
          {Array.from({ length: 75 }, (_, i) => i + 1).map((n) => (
            <div
              key={n}
              style={{
                padding: "6px",
                textAlign: "center",
                borderRadius: "4px",
                backgroundColor: calledNumbers.includes(n) ? "orange" : "#3b1b6f",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {n}
            </div>
          ))}
        </div>
      </div>

      {/* Your Cards */}
      <div style={{ marginBottom: "20px" }}>
        <h4>Your Cards ({myCards.length})</h4>
        {myCards.length === 0 && <p>No cards selected yet...</p>}
        {myCards.map((c, idx) => (
          <div key={idx} style={{ marginBottom: "15px" }}>
            <h5>Card #{c.number}</h5>
            {c.content ? (
              <PlayerCard card={c.content} called={calledNumbers} />
            ) : (
              <p>Loading...</p>
            )}
          </div>
        ))}
      </div>

      {/* Manual Bingo Button */}
      <button
        onClick={handleBingo}
        style={{
          padding: "12px 20px",
          fontWeight: "bold",
          backgroundColor: "gold",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          marginRight: "10px",
        }}
        disabled={gameStatus !== "RUNNING"}
      >
        BINGO!
      </button>

      {/* Start Draw Button (admin/demo only) */}
      {gameStatus === "WAITING" && (
        <button
          onClick={startDraw}
          style={{
            padding: "12px 20px",
            fontWeight: "bold",
            backgroundColor: "#28c76f",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Start Draw
        </button>
      )}

      {/* Winners */}
      {winners.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            backgroundColor: "rgba(0,0,0,0.7)",
            borderRadius: "8px",
          }}
        >
          <h4>🎉 Winners:</h4>
          <ul>
            {winners.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
