import { useState, useEffect } from "react";
import { socket } from "../main.jsx";

export default function Lobby({ onStart, gameInfo }) {
  const TOTAL_CARDS = 400;
  const CARDS_PER_PLAYER = 3;

  const [selectedCards, setSelectedCards] = useState([]); // player's selected cards
  const [takenCards, setTakenCards] = useState([]);       // all cards taken
  const [time, setTime] = useState(30);                   // countdown

  // ==========================
  // Listen lobby updates from backend
  // ==========================
  useEffect(() => {
    socket.on("lobby-update", ({ taken }) => {
      setTakenCards(taken); // array of taken card numbers [12, 55, ...]
    });

    socket.on("game-starting", () => {
      onStart();
    });

    const timer = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    if (time <= 0 && selectedCards.length === CARDS_PER_PLAYER) {
      socket.emit("ready", { selectedCards });
      onStart();
    }

    return () => {
      clearInterval(timer);
      socket.off("lobby-update");
      socket.off("game-starting");
    };
  }, [time, selectedCards]);

  // ==========================
  // Handle Card Selection
  // ==========================
  const handleCardClick = (num) => {
    if (takenCards.includes(num)) return; // already taken
    if (selectedCards.includes(num)) {
      // unselect
      setSelectedCards(selectedCards.filter((c) => c !== num));
    } else {
      if (selectedCards.length < CARDS_PER_PLAYER) {
        setSelectedCards([...selectedCards, num]);
      } else {
        alert(`You can only select ${CARDS_PER_PLAYER} cards`);
      }
    }
  };

  // ==========================
  // Render card grid
  // ==========================
  const renderCardNumber = (num) => {
    let isSelected = selectedCards.includes(num);
    let isTaken = takenCards.includes(num);

    let bgColor = "#eee"; // default
    if (isSelected) bgColor = "green";
    else if (isTaken) bgColor = "pink";

    return (
      <div
        key={num}
        onClick={() => handleCardClick(num)}
        style={{
          width: 40,
          height: 40,
          textAlign: "center",
          lineHeight: "40px",
          background: bgColor,
          margin: 2,
          borderRadius: 6,
          fontWeight: "bold",
          cursor: isTaken ? "not-allowed" : "pointer",
          fontSize: 12,
        }}
      >
        {num}
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <h2>Choose your {CARDS_PER_PLAYER} Bingo Cards</h2>
        <p>Time remaining: {time}s</p>
        <p>Selected: {selectedCards.join(", ")}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          maxHeight: "60vh",
          overflowY: "scroll",
        }}
      >
        {Array.from({ length: TOTAL_CARDS }, (_, i) => renderCardNumber(i + 1))}
      </div>

      {selectedCards.length === CARDS_PER_PLAYER && (
        <button
          onClick={() => socket.emit("ready", { selectedCards })}
          style={{
            marginTop: 20,
            padding: 12,
            background: "gold",
            borderRadius: 10,
            fontWeight: "bold",
          }}
        >
          Ready!
        </button>
      )}
    </div>
  );
}
