import { useEffect, useState } from "react";
import { socket } from "../socket";
import PlayerCard from "../components/PlayerCard";

export default function Game({ onFinish, userTelegramId }) {
  const [playerCards, setPlayerCards] = useState([]);
  const [calledNumbers, setCalledNumbers] = useState([]);

  useEffect(() => {
    socket.on("game-started", ({ players }) => {
      const me = players.find((p) => p.telegramId === userTelegramId);
      if (me) setPlayerCards(me.selectedCards);
    });

    socket.on("number-called", (num) =>
      setCalledNumbers((prev) => [...prev, num])
    );

    socket.on("game-won", (data) => onFinish(data));

    return () => {
      socket.off("game-started");
      socket.off("number-called");
      socket.off("game-won");
    };
  }, []);

  return (
    <div>
      <h2>Bingo Game</h2>
      <div style={{ display: "flex", gap: "12px", overflowX: "auto" }}>
        {playerCards.map((card) => (
          <PlayerCard
            key={card.cardNumber}
            card={card.cardContent}
            called={calledNumbers}
          />
        ))}
      </div>
      <p>Called numbers: {calledNumbers.join(", ")}</p>
    </div>
  );
}
