import { useEffect, useState } from "react";

export default function Lobby({ onStart }) {
  const [time, setTime] = useState(30);

  useEffect(() => {
    const t = setInterval(() => setTime(x => x - 1), 1000);
    if (time === 0) onStart();
    return () => clearInterval(t);
  }, [time]);

  return (
    <div className="box">
      <h2>Waiting for players…</h2>
      <p>Game starts in {time}s</p>
      <p>Bet: 10 ETB</p>
      <p>Derash: 80%</p>
    </div>
  );
}