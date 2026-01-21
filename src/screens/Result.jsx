import { useEffect, useState } from "react";

export default function Result({ data, onNext }) {
  const [time, setTime] = useState(5);

  useEffect(() => {
    const t = setInterval(() => setTime(x => x - 1), 1000);
    if (time === 0) onNext();
    return () => clearInterval(t);
  }, [time]);

  return (
    <div className="box">
      <h1>🎉 BINGO!</h1>
      <p>Winners: {data.winners.length}</p>
      <p>Derash: {data.derash} ETB</p>
      <p>Prize each: {data.prize} ETB</p>
      <p>Next game in {time}s</p>
    </div>
  );
}