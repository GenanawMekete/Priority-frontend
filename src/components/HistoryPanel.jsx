export default function HistoryPanel({ calledNumbers }) {
  return (
    <div className="winner-box">
      <h4>Called Numbers</h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {calledNumbers.map(n => (
          <div key={n} style={{ padding: 4, width: 30, textAlign: "center", background: "#3b1b6f", borderRadius: 4 }}>
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}
