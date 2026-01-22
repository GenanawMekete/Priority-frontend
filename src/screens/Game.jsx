import { useEffect, useState } from "react";
import { socket } from "../socket";
import TopBar from "../components/TopBar";
import BingoBoard from "../components/BingoBoard";
import PlayerCard from "../components/PlayerCard";
import HistoryPanel from "../components/HistoryPanel";

export default function Game({ user, roomId, onFinish }) {
  const [called, setCalled] = useState([]);
  const [card, setCard] = useState(null);

  useEffect(() => {
    socket.emit("join-game", { telegramId: user.telegramId, roomId });

    socket.on("card-assigned", setCard);
    socket.on("number-called", n => setCalled(c => [...c, n]));
    socket.on("game-won", data => onFinish(data));

    return () => {
      socket.off("card-assigned");
      socket.off("number-called");
      socket.off("game-won");
    };
  }, []);

  if (!card) return <div>Loading cards...</div>;

  return (
    <>
      <TopBar user={user} roomId={roomId} />
      <div style={{ display: "flex", gap: 12 }}>
        <BingoBoard called={called} />
        <div>
          <PlayerCard card={card.numbers} called={called} />
          <button
            onClick={() => socket.emit("press-bingo", { telegramId: user.telegramId, roomId })}
            style={{ marginTop: 10, padding: 12, background: "gold", borderRadius: 10, fontWeight: "bold" }}
          >
            BINGO!
          </button>
          <HistoryPanel calledNumbers={called} />
        </div>
      </div>
    </>
  );
}
