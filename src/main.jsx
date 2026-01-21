import { useState, useEffect } from "react";
import Lobby from "./screens/Lobby";
import Game from "./screens/Game";
import Result from "./screens/Result";
import { initTelegram } from "./telegram";

export default function App() {
  const [screen, setScreen] = useState("lobby");
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const u = initTelegram();
    setUser(u);
  }, []);

  if (!user) return <div className="container">Loading Telegram...</div>;

  return (
    <div className="container">
      {screen === "lobby" && <Lobby user={user} onStart={() => setScreen("game")} />}
      {screen === "game" && <Game user={user} onFinish={(r) => { setResult(r); setScreen("result"); }} />}
      {screen === "result" && <Result data={result} onNext={() => setScreen("lobby")} />}
    </div>
  );
}