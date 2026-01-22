import { useEffect, useState } from "react";
import { socket } from "../main.jsx";
import BingoBoard from "../components/BingoBoard";
import PlayerCard from "../components/PlayerCard";

export default function Game({ user, roomId, gameInfo, onFinish }) {
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [cards, setCards] = useState([]); // 3 cards
  const [bingoPressed, setBingoPressed] = useState(false);

  // ==========================
  // Join game & receive cards
  // ==========================
  useEffect(() => {
    socket.emit("join-game", { telegramId: user.telegramId, roomId });

    socket.on("cards-assigned", (cardsAssigned) => {
      setCards(cardsAssigned); // Array of 3 card objects { numbers: [[]] }
    });

    socket.on("number-called", (num) => {
      setCalledNumbers((prev) => [...prev, num]);
    });

    socket.on("game-won", (data) => {
      onFinish(data);
    });

    socket.on("false-bingo", () => {
      alert("Invalid Bingo! This card will be blocked for next game.");
      setBingoPressed(true);
    });

    return () => {
      socket.off("cards-assigned");
      socket.off("number-called");
      socket.off("game-won");
      socket.off("false-bingo");
    };
  }, []);

  // ==========================
  // Manual Bingo Button
  // ==========================
  const handleBingo = () => {
    if (bingoPressed) return; // Already pressed / blocked
    socket.emit("press-bingo", { telegramId: user.telegramId, roomId });
    setBingoPressed(true);
  };

  if (cards.length === 0) return <div>Loading your cards...</div>;

  return (
    <div>
      <h3>Called Numbers:</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {calledNumbers.map((n) => (
          <div
            key={n}
            style={{
              width: 28,
              height: 28,
              textAlign: "center",
              background: "orange",
              color: "white",
              borderRadius: 4,
            }}
          >
            {n}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: 20 }}>
        {cards.map((card, idx) => (
          <PlayerCard key={idx} card={card.numbers} called={calledNumbers} />
        ))}
      </div>

      <button
        onClick={handleBingo}
        style={{
          marginTop: 20,
          padding: 12,
          background: bingoPressed ? "#555" : "gold",
          borderRadius: 10,
          fontWeight: "bold",
        }}
        disabled={bingoPressed}
      >
        BINGO!
      </button>
    </div>
  );
}
