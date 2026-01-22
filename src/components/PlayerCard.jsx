export default function PlayerCard({ card, called }) {
  // card: 5x5 array
  return (
    <div>
      <h4>Your Card</h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 4,
        }}
      >
        {card.flat().map((n, i) => {
          let isFree = n === "FREE";
          let isCalled = called.includes(n);
          return (
            <div
              key={i}
              style={{
                width: 40,
                height: 40,
                textAlign: "center",
                lineHeight: "40px",
                background: isFree ? "gold" : isCalled ? "#28c76f" : "#eee",
                color: isFree || isCalled ? "white" : "#222",
                borderRadius: 6,
                fontWeight: "bold",
              }}
            >
              {n}
            </div>
          );
        })}
      </div>
    </div>
  );
}
