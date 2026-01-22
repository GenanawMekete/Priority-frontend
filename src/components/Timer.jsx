import { useEffect, useState } from "react";

export default function Timer({ duration, onComplete }) {
  const [time, setTime] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => setTime(t => t - 1), 1000);
    if (time <= 0) onComplete();
    return () => clearInterval(interval);
  }, [time]);

  return <div>Time left: {time}s</div>;
}
