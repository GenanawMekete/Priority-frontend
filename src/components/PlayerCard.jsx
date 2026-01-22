export default function PlayerCard({ card, called, index }) {
  return (
    <div style={{ border: "2px solid #4a278a", padding: 8, borderRadius: 10, minWidth: 200 }}>
      <h4>Card {index + 1}</h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 4,
        }}
      >
        {card.flat().map((n, i) => (
          <div
            key={i}
            style={{
              padding: 10,
              borderRadius: 6,
              textAlign: "center",
              fontWeight: "bold",
              background: called.includes(n) ? "#28c76f" : "#eee",
              color: called.includes(n) ? "#fff" : "#222",
            }}
          >
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}
