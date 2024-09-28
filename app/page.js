"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import TimeSelector from "../components/TimeSelector";
import TypingTest from "../components/TypingTest";

export default function Home() {
  const [difficulty, setDifficulty] = useState("easy");
  const [time, setTime] = useState(15);
  const [showingResults, setShowingResults] = useState(false);

  const handleTestEnd = (isShowingResults) => {
    setShowingResults(isShowingResults);
  };

  const handleRestart = () => {
    setShowingResults(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar difficulty={difficulty} setDifficulty={setDifficulty} />
      <div className="container mx-auto p-4">
        {!showingResults && <TimeSelector time={time} setTime={setTime} />}
        <TypingTest
          difficulty={difficulty}
          time={time}
          onTestEnd={handleTestEnd}
          onRestart={handleRestart}
        />
      </div>
    </div>
  );
}
