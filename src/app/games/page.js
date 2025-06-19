"use client";
import React, { useState, useEffect, useRef } from "react";

const BOARD_SIZE = 10; // 10x10 grid
const INITIAL_SNAKE = [[5, 5]];
const INITIAL_DIRECTION = [0, 1]; // moving right

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);

  const intervalRef = useRef(null);

  // Movement Logic
  useEffect(() => {
    if (gameOver) return;
    intervalRef.current = setInterval(() => {
      setSnake(prevSnake => {
        const newHead = [
          prevSnake[0][0] + direction[0],
          prevSnake[0][1] + direction[1],
        ];

        // Check collision
        if (
          newHead[0] < 0 || newHead[0] >= BOARD_SIZE ||
          newHead[1] < 0 || newHead[1] >= BOARD_SIZE ||
          prevSnake.some(seg => seg[0] === newHead[0] && seg[1] === newHead[1])
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setFood(generateFood(newSnake)); // grow
        } else {
          newSnake.pop(); // move
        }

        return newSnake;
      });
    }, 200);
    return () => clearInterval(intervalRef.current);
  }, [direction, food, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;

      switch (e.key) {
        case "ArrowUp":
          if (direction[0] !== 1) setDirection([-1, 0]);
          break;
        case "ArrowDown":
          if (direction[0] !== -1) setDirection([1, 0]);
          break;
        case "ArrowLeft":
          if (direction[1] !== 1) setDirection([0, -1]);
          break;
        case "ArrowRight":
          if (direction[1] !== -1) setDirection([0, 1]);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, gameOver]);

  function generateFood(snake) {
    let newFood;
    do {
      newFood = [
        Math.floor(Math.random() * BOARD_SIZE),
        Math.floor(Math.random() * BOARD_SIZE),
      ];
    } while (snake.some(([x, y]) => x === newFood[0] && y === newFood[1]));
    return newFood;
  }

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem", color: "white" }}>
      <h2>🐍 Snake Game</h2>
      {gameOver && <h3 style={{ color: "red" }}>💀 Game Over</h3>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 20px)`,
          justifyContent: "center",
          border: "4px solid #444",
          margin: "auto",
          backgroundColor: "#111",
        }}
      >
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, idx) => {
          const x = Math.floor(idx / BOARD_SIZE);
          const y = idx % BOARD_SIZE;

          const isSnake = snake.some(seg => seg[0] === x && seg[1] === y);
          const isHead = isSnake && snake[0][0] === x && snake[0][1] === y;
          const isFood = food[0] === x && food[1] === y;

          return (
            <div
              key={idx}
              style={{
                width: 20,
                height: 20,
                backgroundColor: isHead
                  ? "#00ff00"
                  : isSnake
                  ? "#44ff44"
                  : isFood
                  ? "#ff0000"
                  : "#222",
                border: "1px solid #333",
              }}
            />
          );
        })}
      </div>
      <br />
      <button
        onClick={restartGame}
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
