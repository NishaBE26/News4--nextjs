"use client";
import React, { useState } from "react";

const choices = ["Rock", "Paper", "Scissors"];

function getResult(player, computer) {
  if (player === computer) return "It's a Draw!";
  if (
    (player === "Rock" && computer === "Scissors") ||
    (player === "Paper" && computer === "Rock") ||
    (player === "Scissors" && computer === "Paper")
  ) {
    return "🎉 You Win!";
  }
  return "😢 You Lose!";
}

export default function RPSGame() {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState("");

  const handlePlayerChoice = (choice) => {
    const computer = choices[Math.floor(Math.random() * 3)];
    setPlayerChoice(choice);
    setComputerChoice(computer);
    setResult(getResult(choice, computer));
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult("");
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem", color: "white" }}>
      <h2>✊ Rock ✋ Paper ✌️ Scissors</h2>

      {result && (
        <div style={{ marginBottom: "1rem", fontSize: "20px" }}>
          <p>You chose: {playerChoice}</p>
          <p>Computer chose: {computerChoice}</p>
          <p style={{ fontWeight: "bold" }}>{result}</p>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "1rem" }}>
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => handlePlayerChoice(choice)}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: "#f2f2f2",
              color: "#000",
              border: "2px solid #333",
            }}
            disabled={!!result}
          >
            {choice}
          </button>
        ))}
      </div>

      <button onClick={resetGame} style={{ padding: "8px 20px", fontSize: "16px" }}>
        🔁 Play Again
      </button>
    </div>
  );
}
