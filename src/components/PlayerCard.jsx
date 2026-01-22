import React from "react";

// card = array of 25 numbers (5x5 flattened), called = array of numbers called
export default function PlayerCard({ card, called }) {
  // Helper to check if a cell is marked
  const isMarked = (num, idx) => {
    if (num === "FREE") return true;
    return called.includes(num);
  };

  // Optional: you can use this for visual pattern highlight later
  const isWinningPattern = () => {
    // Row, column, diagonal, 4 corners check can be implemented here
    // For now, we just highlight marked numbers
    return false;
  };

  return (
    <div
      style={{
        border: "2px solid #3b1b6f",
        borderRadius: "12px",
        padding: "8px",
        background: "#24164a",
        minWidth: "200px",
      }}
    >
      <h4 style={{ textAlign: "center", marginBottom: "8px" }}>Your Card</h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "4px",
        }}
      >
        {card.map((num, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: isMarked(num, idx) ? "#28c76f" : "#eee",
              color: isMarked(num, idx) ? "white" : "#222",
              fontWeight: "bold",
              textAlign: "center",
              padding: "10px",
              borderRadius: "6px",
              cursor: "default",
            }}
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  );
}
