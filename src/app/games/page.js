"use client";
import React, { useEffect, useState, useRef } from "react";

const sentences = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing fast is fun and helpful for productivity.",
  "React makes building UIs a breeze.",
  "Practice daily to improve your typing speed.",
];

export default function TypingSpeedTest() {
  const [quote, setQuote] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    generateNewQuote();
  }, []);

  const generateNewQuote = () => {
    const random = sentences[Math.floor(Math.random() * sentences.length)];
    setQuote(random);
    setUserInput("");
    setStartTime(null);
    setWpm(null);
    setIsFinished(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!startTime) setStartTime(Date.now());

    if (value === quote) {
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000 / 60; // minutes
      const words = value.trim().split(" ").length;
      const wpmCalc = Math.round(words / duration);
      setWpm(wpmCalc);
      setIsFinished(true);
    }

    setUserInput(value);
  };

  const getHighlightedText = () => {
    const correct = quote.slice(0, userInput.length);
    return (
      <>
        <span style={{ color: "lightgreen" }}>{correct}</span>
        <span style={{ color: "lightgray" }}>{quote.slice(userInput.length)}</span>
      </>
    );
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem", color: "white" }}>
      <h2>⌨️ Typing Speed Test</h2>
      <p style={{ fontSize: "18px", marginBottom: "10px" }}>{getHighlightedText()}</p>
      <textarea
        ref={inputRef}
        value={userInput}
        onChange={handleInputChange}
        rows="3"
        style={{
          width: "80%",
          padding: "10px",
          fontSize: "16px",
          border: "2px solid #888",
          borderRadius: "5px",
        }}
        disabled={isFinished}
      ></textarea>
      <br />
      {isFinished && (
        <p style={{ fontSize: "20px", marginTop: "15px", color: "#00ff00" }}>
          🎉 Your speed: <strong>{wpm} WPM</strong>
        </p>
      )}
      <button
        onClick={generateNewQuote}
        style={{
          marginTop: "20px",
          padding: "8px 20px",
          fontSize: "16px",
          backgroundColor: "#f2f2f2",
          color: "#000",
          border: "2px solid #555",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        🔁 Restart
      </button>
    </div>
  );
}
