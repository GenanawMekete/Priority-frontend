import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import TopBar from "../components/TopBar";
import BingoBoard from "../components/BingoBoard";
import PlayerCard from "../components/PlayerCard";

export default function Game({ telegramId, roomId, myCards }) {
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [winners, setWinners] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Start automatic game draw for this player (server handles actual draw)
    socket.emit("start-game", { roomId });

    // Listen for drawn numbers
    socket.on("number-called", ({ number, roomId: rId }) => {
      if (rId !== roomId) return;
      setCalledNumbers((prev) => [...prev, number]);
    });

    // Listen for winners
    socket.on("game-won", ({ roomId: rId, winners, prize }) => {
      if (rId !== roomId) return;
      setWinners(winners);
      setGameOver(true);
    });

    return () => {
      socket.off("number-called");
      socket.off("game-won");
    };
  }, []);

  const handleBingoPress = () => {
    if (gameOver) return;
    socket.emit("press-bingo", { telegramId, roomId });
  };

  return (
    <div style={{ padding: "12px" }}>
      <TopBar />

      <h3>Live Bingo Draw</h3>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <BingoBoard called={calledNumbers} />
        {myCards.map((card) => (
          <div key={card.number}>
            <h4>Card #{card.number}</h4>
            <PlayerCard card={card.content} called={calledNumbers} />
          </div>
        ))}
      </div>

      <button
        onClick={handleBingoPress}
        style={{
          marginTop: "20px",
          padding: "12px",
          background: "gold",
          borderRadius: "10px",
          fontWeight: "bold",
        }}
      >
        BINGO!
      </button>

      {gameOver && (
        <div style={{ marginTop: "20px", background: "#3b1b6f", padding: "12px", borderRadius: "10px" }}>
          <h2>🎉 Game Over!</h2>
          <p>Winners: {winners.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
