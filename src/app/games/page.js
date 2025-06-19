"use client";
import React, { useState, useEffect } from "react";

export default function NumberGuessingGame() {
  const [target, setTarget] = useState(generateRandom());
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("Guess a number between 1 and 100");
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  function generateRandom() {
    return Math.floor(Math.random() * 100) + 1;
  }

  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > 100) {
      setMessage("❌ Please enter a number between 1 and 100.");
      return;
    }

    setAttempts(attempts + 1);

    if (num === target) {
      setMessage(`🎉 Correct! You guessed it in ${attempts + 1} tries.`);
      setGameOver(true);
    } else if (num < target) {
      setMessage("📉 Too low! Try again.");
    } else {
      setMessage("📈 Too high! Try again.");
    }

    setGuess("");
  };

  const resetGame = () => {
    setTarget(generateRandom());
    setGuess("");
    setMessage("Guess a number between 1 and 100");
    setAttempts(0);
    setGameOver(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem", color: "white" }}>
      <h2>🔢 Number Guessing Game</h2>
      <p style={{ fontSize: "18px", marginBottom: "10px" }}>{message}</p>

      {!gameOver && (
        <>
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "16px",
              width: "100px",
              textAlign: "center",
              marginRight: "10px",
            }}
          />
          <button
            onClick={handleGuess}
            style={{
              padding: "10px 15px",
              fontSize: "16px",
              cursor: "pointer",
              border: "2px solid #444",
              borderRadius: "5px",
              backgroundColor: "#f2f2f2",
              color: "#000",
            }}
          >
            Guess
          </button>
        </>
      )}

      <br />
      <button
        onClick={resetGame}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#f2f2f2",
          color: "#000",
          border: "2px solid #444",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        🔁 Restart
      </button>
    </div>
  );
}
