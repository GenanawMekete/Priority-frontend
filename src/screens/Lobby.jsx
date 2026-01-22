import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import PlayerCard from "../components/PlayerCard";

export default function Lobby({ onStart, telegramId }) {
  const MAX_SELECTION = 3;
  const TOTAL_CARDS = 400;

  const [time, setTime] = useState(30);
  const [takenCards, setTakenCards] = useState([]); // numbers taken by all
  const [myCards, setMyCards] = useState([]); // numbers selected by this player
  const [cardsContent, setCardsContent] = useState({}); // number → card content

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timer);
          onStart();
        }
        return t - 1;
      });
    }, 1000);

    // Listen for any card assignments (all players)
    socket.on("card-assigned", ({ number, content }) => {
      setTakenCards((prev) => {
        if (!prev.includes(number)) return [...prev, number];
        return prev;
      });
      setCardsContent((prev) => ({ ...prev, [number]: content }));
    });

    return () => {
      clearInterval(timer);
      socket.off("card-assigned");
    };
  }, []);

  const handleSelectCard = (num) => {
    // If already selected by this player → unselect
    if (myCards.includes(num)) {
      setMyCards((prev) => prev.filter((n) => n !== num));
      socket.emit("unselect-card", { telegramId, number: num });
      setTakenCards((prev) => prev.filter((n) => n !== num));
      return;
    }

    if (takenCards.includes(num)) return;
    if (myCards.length >= MAX_SELECTION) return;

    // Request server to assign this card
    socket.emit("select-card", { telegramId, number: num });

    // Optimistic UI
    setTakenCards((prev) => [...prev, num]);
    setMyCards((prev) => [...prev, num]);
  };

  return (
    <div style={{ padding: "12px" }}>
      <h2>Choose Your Bingo Cards</h2>
      <p>Time remaining: {time}s</p>
      <p>
        Selected: {myCards.length}/{MAX_SELECTION}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          gap: "6px",
          maxHeight: "50vh",
          overflowY: "auto",
        }}
      >
        {Array.from({ length: TOTAL_CARDS }, (_, i) => i + 1).map((num) => {
          let bg = "#28c76f"; // free
          if (takenCards.includes(num) && !myCards.includes(num)) bg = "#ff7eb6"; // taken by others
          if (myCards.includes(num)) bg = "#1aeb91"; // your selection

          return (
            <div
              key={num}
              onClick={() => handleSelectCard(num)}
              style={{
                padding: "10px",
                borderRadius: "6px",
                textAlign: "center",
                cursor: takenCards.includes(num) && !myCards.includes(num) ? "not-allowed" : "pointer",
                backgroundColor: bg,
                color: "white",
                fontWeight: "bold",
              }}
            >
              {num}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "20px" }}>
        {myCards.map((num, idx) => (
          <div key={idx} style={{ marginBottom: "15px" }}>
            <h4>Card #{num}</h4>
            {cardsContent[num] ? (
              <PlayerCard card={cardsContent[num]} called={[]} />
            ) : (
              <p>Loading card content...</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
