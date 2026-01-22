import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Lobby({ user, roomId, onStart }) {
  const [time, setTime] = useState(30);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.emit("join-game", { telegramId: user.telegramId, roomId });

    socket.on("update-players", setPlayers);

    const interval = setInterval(() => setTime(t => t - 1), 1000);
    if (time <= 0) onStart();

    return () => {
      clearInterval(interval);
      socket.off("update-players");
    };
  }, [time]);

  return (
    <div className="winner-box">
      <h2>Lobby: Room {roomId}</h2>
      <p>Players joined: {players.length}</p>
      <p>Game starts in: {time}s</p>
      <p>Bet: 10 Birr | First-time bonus included</p>
    </div>
  );
}
