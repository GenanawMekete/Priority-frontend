export default function PlayerCard({ card, called }) {
  return (
    <div>
      <h4>Your Cards</h4>
      <div style={{ display: "flex", gap: 8 }}>
        {card.map((singleCard, idx) => (
          <div key={idx} className="card-grid">
            {singleCard.flat().map((n, i) => (
              <div
                key={i}
                className={
                  n === "FREE"
                    ? "card-cell free"
                    : called.includes(n)
                    ? "card-cell marked"
                    : "card-cell"
                }
              >
                {n}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
