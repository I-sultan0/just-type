"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { sentences } from "../data/sentences";

const TypingPractice = () => {
  const [currentText, setCurrentText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [testDuration, setTestDuration] = useState(15); // Default 15 seconds
  const [timeLeft, setTimeLeft] = useState(testDuration);
  const [testActive, setTestActive] = useState(false);
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  const generateText = useCallback(() => {
    const sentencesForDifficulty = sentences[difficulty];
    let text = "";
    while (text.length < 1000) {
      // Ensure the text is at least 1000 characters
      const randomIndex = Math.floor(
        Math.random() * sentencesForDifficulty.length
      );
      text += sentencesForDifficulty[randomIndex] + " ";
    }
    setCurrentText(text.trim());
  }, [difficulty]);

  useEffect(() => {
    generateText();
  }, [generateText]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, [currentText, testActive]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startTest = () => {
    setUserInput("");
    setWpm(null);
    setAccuracy(null);
    setTimeLeft(testDuration);
    setTestActive(true);
    setStartTime(new Date().getTime());
    if (containerRef.current) {
      containerRef.current.focus();
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          endTest();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const endTest = () => {
    setTestActive(false);
    clearInterval(timerRef.current);
    calculateResults();
  };

  const calculateResults = () => {
    const timeElapsed = testDuration / 60; // in minutes
    const wordsTyped = userInput.trim().split(/\s+/).length;
    const calculatedWpm = Math.round(wordsTyped / timeElapsed);
    const calculatedAccuracy = calculateAccuracy(
      currentText.slice(0, userInput.length),
      userInput
    );

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
  };

  const handleKeyDown = (e) => {
    if (!testActive) return;

    if (e.ctrlKey && e.key === "Backspace") {
      e.preventDefault();
      setUserInput(
        (prev) =>
          prev.split(" ").slice(0, -1).join(" ") +
          (prev.endsWith(" ") ? " " : "")
      );
      return;
    }

    if (e.key === "Backspace") {
      setUserInput((prev) => prev.slice(0, -1));
      return;
    }

    if (e.key.length === 1 || e.key === " ") {
      e.preventDefault();
      setUserInput((prev) => prev + e.key);
    }
  };

  const calculateAccuracy = (original, typed) => {
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === original[i]) {
        correct++;
      }
    }
    return Math.round((correct / typed.length) * 100);
  };

  const renderText = () => {
    return currentText.split("").map((char, index) => {
      if (index < userInput.length) {
        return (
          <span
            key={index}
            className={
              char === userInput[index] ? "text-green-600" : "text-red-600"
            }
          >
            {char}
          </span>
        );
      } else if (index === userInput.length && testActive) {
        return (
          <span key={index} className="relative">
            <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-600 animate-blink"></span>
            <span className="text-gray-800">{char}</span>
          </span>
        );
      } else {
        return (
          <span key={index} className="text-gray-800">
            {char}
          </span>
        );
      }
    });
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    generateText();
    resetTest();
  };

  const handleDurationChange = (newDuration) => {
    setTestDuration(newDuration);
    setTimeLeft(newDuration);
    resetTest();
  };

  const resetTest = () => {
    setUserInput("");
    setStartTime(null);
    setWpm(null);
    setAccuracy(null);
    setTestActive(false);
    clearInterval(timerRef.current);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="w-full bg-indigo-600 text-white p-4 shadow-md">
        <div className="max-w-8xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Just Type</h1>
          <div className="flex space-x-4">
            {["easy", "medium", "hard"].map((mode) => (
              <button
                key={mode}
                onClick={() => handleDifficultyChange(mode)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  difficulty === mode
                    ? "bg-white text-indigo-600"
                    : "bg-indigo-500 hover:bg-indigo-400"
                } transition duration-300 ease-in-out`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="w-[95%] max-w-8xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="mb-6 flex justify-center space-x-6">
          {[15, 30, 60].map((duration) => (
            <button
              key={duration}
              onClick={() => handleDurationChange(duration)}
              className={`px-6 py-3 text-lg rounded-lg ${
                testDuration === duration
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } transition duration-300 ease-in-out`}
            >
              {duration} seconds
            </button>
          ))}
        </div>
        <div className="mb-6 text-center">
          <p className="text-3xl font-semibold">
            Time left: <span className="text-indigo-600">{timeLeft}</span>{" "}
            seconds
          </p>
        </div>
        <div className="mb-6 flex justify-center">
          <button
            onClick={startTest}
            disabled={testActive}
            className={`px-8 py-4 text-xl rounded-lg ${
              testActive
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            } transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
          >
            {testActive ? "Test in Progress" : "Start Test"}
          </button>
        </div>
        <div
          ref={containerRef}
          className={`mb-10 p-8 bg-gray-100 rounded-lg outline-none h-96 overflow-y-auto ${
            testActive ? "" : "pointer-events-none opacity-50"
          }`}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <p className="text-2xl font-medium leading-relaxed tracking-wide">
            {renderText()}
          </p>
        </div>
        <div className="mt-8 flex justify-center items-center space-x-12">
          <p className="text-3xl font-semibold">
            WPM:{" "}
            <span className="text-indigo-600">{wpm !== null ? wpm : "-"}</span>
          </p>
          <p className="text-3xl font-semibold">
            Accuracy:{" "}
            <span className="text-indigo-600">
              {accuracy !== null ? `${accuracy}%` : "-"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TypingPractice;
