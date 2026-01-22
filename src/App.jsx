import { useState, useEffect } from "react";
import Lobby from "./screens/Lobby";
import Game from "./screens/Game";
import Result from "./screens/Result";
import { socket, tg } from "./main.jsx";

export default function App({ user, roomId, connected }) {
  const [screen, setScreen] = useState("lobby"); // lobby → game → result
  const [resultData, setResultData] = useState(null);
  const [gameInfo, setGameInfo] = useState({
    bet: 10,
    derash: 0,
    players: [],
  });

  // ==========================
  // Join Room & Listen Game Updates
  // ==========================
  useEffect(() => {
    if (!connected) return;

    // Join room in backend
    socket.emit("join-room", { telegramId: user.telegramId, roomId });

    // Lobby update
    socket.on("lobby-update", (data) => {
      setGameInfo((prev) => ({ ...prev, players: data.players }));
    });

    // Game start
    socket.on("start-game", (data) => {
      setGameInfo((prev) => ({ ...prev, derash: data.derash }));
      setScreen("game");
    });

    // Game finished
    socket.on("game-won", (data) => {
      setResultData(data);
      setScreen("result");
    });

    return () => {
      socket.emit("leave-room", { telegramId: user.telegramId, roomId });
      socket.off("lobby-update");
      socket.off("start-game");
      socket.off("game-won");
    };
  }, [connected, roomId]);

  // ==========================
  // Screen Flow
  // ==========================
  const renderScreen = () => {
    switch (screen) {
      case "lobby":
        return <Lobby onStart={() => setScreen("game")} gameInfo={gameInfo} />;
      case "game":
        return <Game
          user={user}
          roomId={roomId}
          gameInfo={gameInfo}
          onFinish={(data) => { setResultData(data); setScreen("result"); }}
        />;
      case "result":
        return <Result data={resultData} onNext={() => setScreen("lobby")} />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="container">
      <div className="top-bar">
        <div>{user.firstName}</div>
        <div>Balance: {user.balance} ETB</div>
        <div>Room: {roomId}</div>
      </div>
      {renderScreen()}
    </div>
  );
}
