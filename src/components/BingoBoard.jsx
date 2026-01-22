import React from "react";

export default function BingoBoard({ called }) {
  const numbers = Array.from({ length: 75 }, (_, i) => i + 1);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(15, 1fr)", gap: 4 }}>
      {numbers.map((n) => (
        <div
          key={n}
          style={{
            padding: 6,
            borderRadius: 4,
            textAlign: "center",
            backgroundColor: called.includes(n) ? "orange" : "#ddd",
            color: called.includes(n) ? "white" : "#222",
            fontWeight: "bold",
          }}
        >
          {n}
        </div>
      ))}
    </div>
  );
}
