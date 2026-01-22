import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import PlayerCard from "../components/PlayerCard";

export default function Lobby({ telegramId, onGameStart }) {
  const MAX_SELECTION = 3;
  const TOTAL_CARDS = 400;
  const LOBBY_TIME = 30;

  const [time, setTime] = useState(LOBBY_TIME);
  const [takenCards, setTakenCards] = useState([]); // numbers already taken
  const [myCards, setMyCards] = useState([]); // selected by this player
  const [cardsContent, setCardsContent] = useState({}); // number → card content

  const roomId = "default-room"; // future multi-room support

  useEffect(() => {
    // Join lobby
    socket.emit("join-lobby", { telegramId, roomId });

    // Receive currently taken cards
    socket.on("current-taken-cards", ({ cards }) => {
      const numbers = cards.map((c) => c.number);
      const contentMap = {};
      cards.forEach((c) => (contentMap[c.number] = c.content));
      setTakenCards(numbers);
      setCardsContent(contentMap);
    });

    // New card assignment
    socket.on("card-assigned", ({ number, content }) => {
      setTakenCards((prev) => [...prev, number]);
      setCardsContent((prev) => ({ ...prev, [number]: content }));
    });

    // Lobby countdown
    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(timer);
          onGameStart(roomId, myCards); // start game automatically
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      socket.off("current-taken-cards");
      socket.off("card-assigned");
    };
  }, []);

  const handleSelectCard = (num) => {
    if (takenCards.includes(num)) return;
    if (myCards.length >= MAX_SELECTION) return;

    // Request server to assign this card
    socket.emit("select-card", { telegramId, roomId, number: num });

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
