
import { useEffect, useState } from "react";

export default function Result({ data, onNext }) {
  const [time, setTime] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t - 1), 1000);
    if (time <= 0) onNext();
    return () => clearInterval(interval);
  }, [time]);

  if (!data) return null;

  return (
    <div className="winner-box">
      <h1>🎉 BINGO!</h1>
      <p>{data.winners.length} player(s) won</p>
      <p>Derash: {data.derash.toFixed(2)} ETB</p>
      <p>Prize per winner: {data.prize.toFixed(2)} ETB</p>
      <p>Next game in {time}s...</p>
    </div>
  );
}
