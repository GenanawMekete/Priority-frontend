import { useEffect, useState } from "react";
import { socket } from "../socket";
import TopBar from "../components/TopBar";
import PlayerCard from "../components/PlayerCard";

export default function Game({ onFinish }) {
  const [called, setCalled] = useState([]);
  const [cards, setCards] = useState([]); // 3 cards
  const [telegramId, setTelegramId] = useState(""); // fill via WebApp init
  const [hasBingo, setHasBingo] = useState(false);
  const [gameStatus, setGameStatus] = useState("LOBBY");

  // Assign cards & listen events
  useEffect(() => {
    // Join game
    socket.emit("join-game", { telegramId });

    socket.on("cards-assigned", (cards) => setCards(cards));

    socket.on("number-called", (num) => setCalled((c) => [...c, num]));

    socket.on("game-won", (data) => {
      setGameStatus("FINISHED");
      onFinish(data);
    });

    socket.on("new-round", () => {
      setCalled([]);
      setHasBingo(false);
      setGameStatus("LOBBY");
    });

    return () => {
      socket.off("cards-assigned");
      socket.off("number-called");
      socket.off("game-won");
      socket.off("new-round");
    };
  }, []);

  const pressBingo = () => {
    if (hasBingo) return;
    socket.emit("press-bingo", { telegramId });
    setHasBingo(true); // prevent multiple presses
  };

  return (
    <>
      <TopBar calledNumbers={called} status={gameStatus} />

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {cards.map((card, idx) => (
          <PlayerCard key={idx} card={card.numbers} called={called} index={idx} />
        ))}
      </div>

      <button
        onClick={pressBingo}
        style={{
          marginTop: 12,
          padding: 12,
          background: hasBingo ? "gray" : "gold",
          borderRadius: 10,
          fontWeight: "bold",
          cursor: hasBingo ? "not-allowed" : "pointer",
        }}
      >
        BINGO!
      </button>
    </>
  );
}
