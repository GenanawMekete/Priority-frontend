import { useEffect, useState } from "react";
import { socket } from "../socket";
import TopBar from "../components/TopBar";
import BingoBoard from "../components/BingoBoard";
import PlayerCard from "../components/PlayerCard";

export default function Game({ onFinish, telegramId }) {
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [gameStatus, setGameStatus] = useState("WAITING"); // WAITING, RUNNING, FINISHED
  const [winnerInfo, setWinnerInfo] = useState(null);

  useEffect(() => {
    // Join game
    socket.emit("join-game", { telegramId });

    // Card assigned
    socket.on("card-assigned", ({ number, content }) => {
      setPlayerCards((prev) => [...prev, { number, numbers: content }]);
    });

    // Number drawn
    socket.on("number-called", (num) => {
      setCalledNumbers((prev) => [...prev, num]);
    });

    // Game finished
    socket.on("game-won", (data) => {
      setWinnerInfo(data);
      setGameStatus("FINISHED");
      if (onFinish) onFinish(data);
    });

    // New round
    socket.on("new-round", () => {
      setCalledNumbers([]);
      setPlayerCards([]);
      setGameStatus("WAITING");
      setWinnerInfo(null);
    });

    // Player count or messages can be received
    socket.on("player-count", (data) => {
      console.log("Players in lobby:", data.count);
    });

    return () => {
      socket.off("card-assigned");
      socket.off("number-called");
      socket.off("game-won");
      socket.off("new-round");
      socket.off("player-count");
    };
  }, []);

  const pressBingo = () => {
    socket.emit("press-bingo", { telegramId });
  };

  const startGame = () => {
    socket.emit("start-game");
    setGameStatus("RUNNING");
  };

  return (
    <div>
      <TopBar status={gameStatus} calledNumbers={calledNumbers} />

      {gameStatus === "WAITING" && (
        <div style={{ margin: "10px 0" }}>
          <button onClick={startGame} style={{ padding: "10px 20px", fontWeight: "bold" }}>
            Start Game
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {playerCards.map((card, i) => (
          <PlayerCard key={i} card={card.numbers} called={calledNumbers} cardNumber={card.number} />
        ))}
      </div>

      {gameStatus === "RUNNING" && (
        <button
          onClick={pressBingo}
          style={{
            marginTop: 20,
            padding: "12px 20px",
            background: "gold",
            borderRadius: 8,
            fontWeight: "bold",
          }}
        >
          BINGO!
        </button>
      )}

      {gameStatus === "FINISHED" && winnerInfo && (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            background: "rgba(0,0,0,0.7)",
            borderRadius: 12,
            color: "white",
            textAlign: "center",
          }}
        >
          <h2>🎉 BINGO!</h2>
          <p>{winnerInfo.winners.length} winners</p>
          <p>Derash: {winnerInfo.derash} ETB</p>
          <p>Prize per winner: {winnerInfo.prizePerWinner} ETB</p>
        </div>
      )}
    </div>
  );
}
