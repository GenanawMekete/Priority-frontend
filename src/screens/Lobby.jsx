import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import PlayerCard from "../components/PlayerCard";

export default function Lobby({ telegramId, onStart, roomId = "default" }) {
  const MAX_SELECTION = 3;
  const TOTAL_CARDS = 400;

  const [time, setTime] = useState(30);
  const [takenCards, setTakenCards] = useState([]); // cards taken globally
  const [myCards, setMyCards] = useState([]); // cards selected by this player
  const [cardsContent, setCardsContent] = useState({}); // number → card content

  // ===========================
  // Countdown Timer
  // ===========================
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timer);
          onStart(); // move to Game.jsx
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ===========================
  // Socket Listeners
  // ===========================
  useEffect(() => {
    // Join room
    socket.emit("join-lobby", { telegramId, roomId });

    // Listen for card assignment updates from server
    socket.on("card-assigned", ({ number, content }) => {
      setTakenCards((prev) => [...prev, number]);
      setCardsContent((prev) => ({ ...prev, [number]: content }));
    });

    // Receive multiple cards at once (e.g., on reconnect)
    socket.on("current-taken-cards", ({ cards }) => {
      setTakenCards(cards.map((c) => c.number));
      const contentMap = {};
      cards.forEach((c) => (contentMap[c.number] = c.content));
      setCardsContent(contentMap);
    });

    return () => {
      socket.off("card-assigned");
      socket.off("current-taken-cards");
    };
  }, []);

  // ===========================
  // Handle Card Selection
  // ===========================
  const handleSelectCard = (num) => {
    if (takenCards.includes(num)) return;
    if (myCards.length >= MAX_SELECTION) return;

    // Request server to assign this card
    socket.emit("select-card", { telegramId, roomId, number: num });

    // Optimistic UI
    setMyCards((prev) => [...prev, num]);
    setTakenCards((prev) => [...prev, num]);
  };

  return (
    <div style={{ padding: "12px" }}>
      <h2>Choose Your Bingo Cards</h2>
      <p>Time remaining: {time}s</p>
      <p>
        Selected: {myCards.length}/{MAX_SELECTION}
      </p>

      {/* Scrollable Card Grid 1–400 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          gap: "6px",
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid #444",
          padding: "6px",
          borderRadius: "8px",
          backgroundColor: "#1a0f2e",
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

      {/* Display Selected Cards Content */}
      <div style={{ marginTop: "20px" }}>
        {myCards.map((num, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "15px",
              padding: "8px",
              border: "1px solid #444",
              borderRadius: "6px",
              backgroundColor: "#24164a",
            }}
          >
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
