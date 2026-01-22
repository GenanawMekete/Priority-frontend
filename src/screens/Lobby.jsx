import React, { useEffect, useState } from "react";
import PlayerCard from "../components/PlayerCard";
import { socket } from "../socket";

export default function Lobby({ onStart, telegramId }) {
  const MAX_SELECTION = 3;
  const TOTAL_CARDS = 400;

  const [time, setTime] = useState(30);
  const [takenCards, setTakenCards] = useState([]);
  const [myCards, setMyCards] = useState([]);
  const [cardsContent, setCardsContent] = useState({});

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

    // Listen for card assignment from server
    socket.on("card-assigned", ({ number, content }) => {
      setTakenCards((prev) => [...prev, number]);
      setCardsContent((prev) => ({ ...prev, [number]: content }));
    });

    return () => {
      clearInterval(timer);
      socket.off("card-assigned");
    };
  }, []);

  const handleSelectCard = (num) => {
    if (takenCards.includes(num)) return;
    if (myCards.length >= MAX_SELECTION) return;

    socket.emit("select-card", { telegramId, number: num });

    setTakenCards((prev) => [...prev, num]);
    setMyCards((prev) => [...prev, num]);
  };

  return (
    <div className="container">
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
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {Array.from({ length: TOTAL_CARDS }, (_, i) => i + 1).map((num) => (
          <div
            key={num}
            onClick={() => handleSelectCard(num)}
            style={{
              padding: "10px",
              borderRadius: "6px",
              textAlign: "center",
              cursor:
                takenCards.includes(num) || myCards.length >= MAX_SELECTION
                  ? "not-allowed"
                  : "pointer",
              backgroundColor: takenCards.includes(num) ? "#ff7eb6" : "#28c76f",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {num}
          </div>
        ))}
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
