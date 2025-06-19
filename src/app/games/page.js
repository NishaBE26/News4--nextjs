"use client";
import React, { useState, useEffect } from "react";

export default function GamesPage() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // You are X
  const [winner, setWinner] = useState(null);

  const handleClick = (i) => {
    if (squares[i] || winner || !isPlayerTurn) return;
    const nextSquares = [...squares];
    nextSquares[i] = "X";
    setSquares(nextSquares);
    setIsPlayerTurn(false);
  };

  useEffect(() => {
    const gameWinner = calculateWinner(squares);
    if (gameWinner) {
      setWinner(gameWinner);
      return;
    }

    if (!isPlayerTurn) {
      const emptyIndexes = squares.map((val, idx) => (val === null ? idx : null)).filter(val => val !== null);
      if (emptyIndexes.length === 0) return;

      const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
      setTimeout(() => {
        const newSquares = [...squares];
        newSquares[randomIndex] = "O";
        setSquares(newSquares);
        setIsPlayerTurn(true);
      }, 500); // delay for realism
    }
  }, [squares, isPlayerTurn]);

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <p style={{ fontSize: "24px", fontWeight: "bold" ,color: "white"}}>
        {winner
          ? `🎉 Winner: ${winner}`
          : squares.every((val) => val !== null)
          ? "It's a Draw!"
          : `Turn: ${isPlayerTurn ? "You (X)" : "Computer (O)"}`}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 80px)",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {squares.map((val, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            disabled={!!val || winner}
            style={{
              width: "80px",
              height: "80px",
              fontSize: "24px",
              fontWeight: "bold",
              cursor: val || winner ? "not-allowed" : "pointer",
              backgroundColor: "#f2f2f2",
              border: "2px solid #555",
              borderRadius: "8px",
            }}
          >
            {val}
          </button>
        ))}
      </div>
      <br />
      <button onClick={resetGame} style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}>
        🔁 Restart
      </button>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
