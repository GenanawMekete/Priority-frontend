import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import PlayerCard from "../components/PlayerCard";

export default function Game({ telegramId, onFinish }) {
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [myCards, setMyCards] = useState([]);
  const [winners, setWinners] = useState([]);
  const [derash, setDerash] = useState(0);

  useEffect(() => {
    // Join game
    socket.emit("join-game", { telegramId });

    // Receive player cards
    socket.on("cards-assigned", (cards) => setMyCards(cards));

    // Receive called numbers
    socket.on("number-called", (num) =>
      setCalledNumbers((prev) => [...prev, num])
    );

    // Receive game won
    socket.on("game-won", ({ winners, derash }) => {
      setWinners(winners);
      setDerash(derash);
      setTimeout(() => onFinish(), 5000); // auto proceed to next round
    });

    return () => {
      socket.off("cards-assigned");
      socket.off("number-called");
      socket.off("game-won");
    };
  }, []);

  const pressBingo = () => {
    socket.emit("press-bingo", { telegramId });
  };

  return (
    <div className="container">
      <h2>Game Running</h2>
      <button className="bingo-btn" onClick={pressBingo}>
        BINGO!
      </button>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {myCards.map((card, idx) => (
          <div key={idx}>
            <h4>Card #{card.number}</h4>
            <PlayerCard card={card.numbers} called={calledNumbers} />
          </div>
        ))}
      </div>

      <div className="winner-box" style={{ marginTop: 20 }}>
        {winners.length > 0 && (
          <>
            <h3>🎉 Winners!</h3>
            <p>{winners.join(", ")}</p>
            <p>Derash: {derash}</p>
          </>
        )}
      </div>
    </div>
  );
}
