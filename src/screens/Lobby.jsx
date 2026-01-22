import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Lobby({ onStart, userTelegramId }) {
  const [cardsStatus, setCardsStatus] = useState(
    Array.from({ length: 400 }, () => "free")
  );
  const [selectedCards, setSelectedCards] = useState([]);
  const [time, setTime] = useState(30);

  useEffect(() => {
    socket.emit("join-lobby", { telegramId: userTelegramId });

    socket.on("lobby-status", ({ takenCards, playerCards }) => {
      const newStatus = [...cardsStatus];
      takenCards.forEach((n) => (newStatus[n - 1] = "taken"));
      setCardsStatus(newStatus);
      setSelectedCards(playerCards);
    });

    socket.on("card-taken", ({ cardNumber }) => {
      setCardsStatus((prev) => {
        const newStatus = [...prev];
        newStatus[cardNumber - 1] = "taken";
        return newStatus;
      });
    });

    socket.on("cards-assigned", ({ cardNumber, cardContent }) => {
      setSelectedCards((prev) => [...prev, { cardNumber, cardContent }]);
      setCardsStatus((prev) => {
        const newStatus = [...prev];
        newStatus[cardNumber - 1] = "taken";
        return newStatus;
      });
    });

    socket.on("game-started", () => onStart());

    return () => {
      socket.off("lobby-status");
      socket.off("card-taken");
      socket.off("cards-assigned");
      socket.off("game-started");
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTime((x) => x - 1), 1000);
    if (time === 0) onStart();
    return () => clearInterval(t);
  }, [time]);

  const handleCardClick = (num) => {
    if (cardsStatus[num - 1] === "taken") return;
    if (selectedCards.length >= 3) return;
    socket.emit("select-card", { telegramId: userTelegramId, cardNumber: num });
  };

  return (
    <div>
      <h2>Lobby - Pick up to 3 cards</h2>
      <p>Time remaining: {time}s</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 1fr)",
          gap: "4px",
          maxHeight: "400px",
          overflowY: "scroll",
        }}
      >
        {cardsStatus.map((status, i) => (
          <div
            key={i}
            onClick={() => handleCardClick(i + 1)}
            style={{
              padding: "6px",
              background: status === "free" ? "green" : "pink",
              color: "white",
              textAlign: "center",
              cursor: status === "free" ? "pointer" : "not-allowed",
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <p>
        Selected cards:{" "}
        {selectedCards.map((c) => c.cardNumber).join(", ") || "None"}
      </p>
    </div>
  );
}
