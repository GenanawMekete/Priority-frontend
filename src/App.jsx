import { useEffect, useState } from "react";
import axios from "axios";
import Lobby from "./screens/Lobby";
import Game from "./screens/Game";
import Result from "./screens/Result";

export default function App() {
  const [screen, setScreen] = useState("lobby");
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);
  const [roomId, setRoomId] = useState("main");

  useEffect(() => {
    // Detect room query param
    const urlParams = new URLSearchParams(window.location.search);
    const room = urlParams.get("room");
    if (room) setRoomId(room);

    // Telegram WebApp auth
    const tg = window.Telegram?.WebApp;
    if (tg?.initData) {
      axios
        .post("https://priority-backend-c5sb.onrender.com/api/auth/telegram", { initData: tg.initData })
        .then(res => setUser(res.data.user))
        .catch(console.error);
    }
  }, []);

  if (!user) return <div>Loading Telegram login...</div>;

  return (
    <div className="container">
      {screen === "lobby" && <Lobby user={user} roomId={roomId} onStart={() => setScreen("game")} />}
      {screen === "game" && <Game user={user} roomId={roomId} onFinish={r => { setResult(r); setScreen("result"); }} />}
      {screen === "result" && <Result data={result} onNext={() => setScreen("lobby")} />}
    </div>
  );
}
