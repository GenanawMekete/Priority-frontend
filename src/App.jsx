import { useEffect, useState } from "react";
import Lobby from "./screens/Lobby";
import Game from "./screens/Game";
import Result from "./screens/Result";
import axios from "axios";

export default function App() {
  const [screen, setScreen] = useState("lobby");
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);
  const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("room") || "main";
socket.emit("join-game", { telegramId: user.telegramId, roomId });

  useEffect(() => {
    if (window.Telegram.WebApp.initData) {
      const tg = window.Telegram.WebApp;
      const tgData = tg.initData;

      // Send initData to backend to verify & create user
      axios.post("https://priority-backend-c5sb.onrender.com/api/auth/telegram", {
        initData: tgData
      }).then(res => {
        setUser(res.data.user);
      }).catch(console.error);
    }
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container">
      {screen === "lobby" && <Lobby onStart={() => setScreen("game")} />}
      {screen === "game" && <Game user={user} onFinish={(r) => { setResult(r); setScreen("result"); }} />}
      {screen === "result" && <Result data={result} onNext={() => setScreen("lobby")} />}
    </div>
  );
}
