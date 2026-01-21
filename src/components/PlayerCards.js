export default function HistoryPanel({ called }) {
  return (
    <div className="history">
      <h4>Called Numbers</h4>
      {called.map((n, i) => <span key={i}>{n}, </span>)}
    </div>
  );
}