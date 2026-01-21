import { useEffect, useState } from "react";
import { socket } from "../socket";
import TopBar from "../components/TopBar";
import BingoBoard from "../components/BingoBoard";
import PlayerCards from "../components/PlayerCards";
import HistoryPanel from "../components/HistoryPanel";
import BingoButton from "../components/BingoButton";

export default function Game({ user, onFinish }) {
  const [called, setCalled] = useState([]);
  const [cards, setCards] = useState([]);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    socket.emit("join-game", { telegramId: user.id });

    socket.on("cards-assigned", setCards);
    socket.on("number-called", n => setCalled(c => [...c, n]));
    socket.on("false-bingo", () => setBlocked(true));
    socket.on("game-won", data => onFinish(data));

  }, []);

  if (!cards.length) return <div>Assigning cards…</div>;

  return (
    <>
      <TopBar />

      <div style={{ display: "flex", gap: 10 }}>
        <BingoBoard called={called} />
        <HistoryPanel called={called} />
      </div>

      <PlayerCards cards={cards} called={called} blocked={blocked} />

      <BingoButton user={user} disabled={blocked} />
    </>
  );
}


