import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import TopBar from "../components/TopBar";
import PlayerCard from "../components/PlayerCard";

export default function Game({ onFinish, telegramId }) {
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [cards, setCards] = useState([]);
  const [winners, setWinners] = useState([]);
  const [bingoDisabled, setBingoDisabled] = useState(false);

  // Called numbers history
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Join game with telegramId
    socket.emit("join-game", { telegramId });

    socket.on("cards-assigned", (playerCards) => {
      setCards(playerCards); // playerCards: array of 3 cards [{numbers: [...]}, ...]
    });

    socket.on("number-called", (num) => {
      setCalledNumbers((prev) => [...prev, num]);
      setHistory((prev) => [...prev, num]);
    });

    socket.on("game-won", (data) => {
      setWinners(data.winners);
      setBingoDisabled(true);

      // Show 5s winner screen
      setTimeout(() => {
        onFinish(data);
      }, 5000);
    });

    socket.on("false-bingo", () => {
      alert("⚠️ Invalid Bingo! Your card will be blocked for this round.");
      setBingoDisabled(true);
    });

    return () => {
      socket.off("cards-assigned");
      socket.off("number-called");
      socket.off("game-won");
      socket.off("false-bingo");
    };
  }, []);

  const handleBingo = () => {
    if (!bingoDisabled) {
      socket.emit("press-bingo", { telegramId });
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <TopBar calledNumbers={calledNumbers.length} />

      <h3>Your Cards</h3>
      <div style={{ display: "flex", gap: "12px", overflowX: "auto" }}>
        {cards.map((cardObj, idx) => (
          <PlayerCard key={idx} card={cardObj.numbers} called={calledNumbers} />
        ))}
      </div>

      <button
        onClick={handleBingo}
        disabled={bingoDisabled}
        style={{
          marginTop: "15px",
          padding: "12px 20px",
          background: bingoDisabled ? "#ccc" : "gold",
          fontWeight: "bold",
          borderRadius: "8px",
          cursor: bingoDisabled ? "not-allowed" : "pointer",
        }}
      >
        BINGO!
      </button>

      <div style={{ marginTop: "20px" }}>
        <h4>Called Numbers History</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {history.map((n, i) => (
            <div
              key={i}
              style={{
                width: "35px",
                height: "35px",
                background: "#3b1b6f",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "6px",
              }}
            >
              {n}
            </div>
          ))}
        </div>
      </div>

      {winners.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "rgba(0,0,0,0.7)",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h2>🎉 Winners!</h2>
          <p>{winners.length} player(s) won this round.</p>
        </div>
      )}
    </div>
  );
}
