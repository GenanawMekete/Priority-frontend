import { socket } from "../socket";

export default function BingoButton({ user, disabled }) {
  return (
    <button
      className="bingo-btn"
      disabled={disabled}
      onClick={() => socket.emit("press-bingo", { telegramId: user.id })}
    >
      {disabled ? "BLOCKED" : "BINGO!"}
    </button>
  );
}


