export default function PlayerCards({ cards, called, blocked }) {
  return (
    <div className="cards-wrapper">
      {cards.map((card, idx) => (
        <div key={idx} className="card-grid">
          {card.flat().map((n, i) => (
            <div
              key={i}
              className={`card-cell ${called.includes(n) ? "marked" : ""} ${blocked ? "blocked" : ""}`}
            >
              {n}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

