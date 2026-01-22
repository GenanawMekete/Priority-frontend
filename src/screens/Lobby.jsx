import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Lobby({ onStart }) {
  const [time, setTime] = useState(30);
  const [cardsStatus, setCardsStatus] = useState(
    Array.from({ length: 400 }, () => "free") // free, taken
  );
  const [selectedCard, setSelectedCard] = useState(null);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => setTime((t) => t - 1), 1000);
    if (time <= 0) {
      onStart();
    }
    return () => clearInterval(interval);
  }, [time]);

  // Listen to taken cards updates from backend
  useEffect(() => {
    socket.on("card-taken", ({ cardNumber }) => {
      setCardsStatus((prev) => {
        const newStatus = [...prev];
        newStatus[cardNumber - 1] = "taken";
        return newStatus;
      });
    });

    socket.on("cards-assigned", ({ cardNumber, cardContent }) => {
      setSelectedCard({ cardNumber, cardContent });
    });

    return () => {
      socket.off("card-taken");
      socket.off("cards-assigned");
    };
  }, []);

  const handleCardClick = (num) => {
    if (cardsStatus[num - 1] === "taken") return; // already taken
    // Request backend to assign this card
    socket.emit("select-card", { cardNumber: num });
  };

  return (
    <div style={{ padding: 12 }}>
      <h2>Choose your Bingo Card</h2>
      <p>Game starts in: {time}s</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          gap: 6,
          maxHeight: "400px",
          overflowY: "scroll",
          border: "1px solid #4a278a",
          padding: 8,
          borderRadius: 8,
        }}
      >
        {cardsStatus.map((status, idx) => (
          <div
            key={idx}
            onClick={() => handleCardClick(idx + 1)}
            style={{
              padding: 8,
              borderRadius: 6,
              textAlign: "center",
              cursor: status === "free" ? "pointer" : "not-allowed",
              background: status === "free" ? "green" : "pink",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            {idx + 1}
          </div>
        ))}
      </div>

      {selectedCard && (
        <div
          style={{
            marginTop: 20,
            padding: 12,
            border: "2px solid #4a278a",
            borderRadius: 10,
            background: "#1a0f2e",
          }}
        >
          <h3>Preview Card {selectedCard.cardNumber}</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 4,
            }}
          >
            {selectedCard.cardContent.flat().map((n, i) => (
              <div
                key={i}
                style={{
                  padding: 10,
                  borderRadius: 6,
                  textAlign: "center",
                  fontWeight: "bold",
                  background: "#eee",
                  color: "#222",
                }}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
