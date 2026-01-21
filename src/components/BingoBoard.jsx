export default function BingoBoard({ called }) {
  const nums = Array.from({ length: 75 }, (_, i) => i + 1);

  return (
    <div className="board">
      {nums.map(n => (
        <div key={n} className={called.includes(n) ? "cell called" : "cell"}>
          {n}
        </div>
      ))}
    </div>
  );
}