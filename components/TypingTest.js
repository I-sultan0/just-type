"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import TestResults from "./TestResults";

const sentences = {
  easy: [
    "the quick brown fox jumps over the lazy dog a journey of a thousand miles begins with a single step",
    "programming is the art of telling another human what one wants the computer to do",
    "in computer science we stand on each others shoulders and the shoulders of giants",
    "coding is not just about making things work its about making things work well",
    "practice is the best of all instructors debugging is twice as hard as writing the code in the first place",
    "the only way to learn a new programming language is by writing programs in it",
    "simplicity is the ultimate sophistication make it work make it right make it fast",
    "its not a bug its an undocumented feature good code is its own best documentation",
    "measure twice cut once apply this to programming and measure twice code once",
    "programming today is a race between software engineers striving to build bigger and better idiot proof programs and the universe trying to produce bigger and better idiots so far the universe is winning",
  ],
  medium: [
    "The greatest glory in living lies not in never falling but in rising every time we fall",
    "Life is what happens when you are busy making other plans Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live",
    "Any fool can write code that a computer can understand Good programmers write code that humans can understand",
    "First solve the problem Then write the code Simplicity is the soul of efficiency",
    "Programming is not about typing its about thinking Measuring programming progress by lines of code is like measuring aircraft building progress by weight",
    "The best way to predict the future is to invent it Computers are good at following instructions but not at reading your mind",
    "Sometimes it pays to stay in bed on Monday rather than spending the rest of the week debugging Mondays code",
    "Perfection is achieved not when there is nothing more to add but when there is nothing left to take away",
    "Programming is breaking of one big impossible task into several very small possible tasks",
    "The most disastrous thing that you can ever learn is your first programming language",
  ],
  hard: [
    "The only way to learn a new programming language is by writing programs in it. Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Some people, when confronted with a problem, think 'I know, I'll use regular expressions.' Now they have two problems. There are only two hard things in Computer Science: cache invalidation and naming things.",
    "Walking on water and developing software from a specification are easy if both are frozen. Software and cathedrals are much the same – first we build them, then we pray.",
    "It's not a bug – it's an undocumented feature. Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.",
    "There are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies, and the other way is to make it so complicated that there are no obvious deficiencies.",
    "Programming today is a race between software engineers striving to build bigger and better idiot-proof programs, and the universe trying to produce bigger and better idiots. So far, the universe is winning.",
    "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else. (Eagleson's Law)",
    "Weeks of coding can save you hours of planning. Code never lies, comments sometimes do.",
    "Optimism is an occupational hazard of programming; feedback is the treatment. Hofstadter's Law: It always takes longer than you expect, even when you take into account Hofstadter's Law.",
    "The first 90% of the code accounts for the first 90% of the development time. The remaining 10% of the code accounts for the other 90% of the development time. (Tom Cargill)",
  ],
};

const TypingTest = ({ difficulty, time, onTestEnd, onRestart }) => {
  const [text, setText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(time);
  const [testActive, setTestActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [typingData, setTypingData] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    resetTest();
  }, [difficulty, time]);

  useEffect(() => {
    if (testActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        updateTypingData();
      }, 1000);
    } else if (timeLeft === 0 || !testActive) {
      clearInterval(intervalRef.current);
      if (timeLeft === 0) {
        endTest();
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [testActive, timeLeft]);

  const updateTypingData = useCallback(() => {
    if (startTime) {
      const elapsedTime = (Date.now() - startTime) / 60000; // time in minutes
      if (elapsedTime > 0) {
        const wordsTyped = userInput.trim().split(" ").length;
        const currentWPM = Math.round(wordsTyped / elapsedTime);
        setTypingData((prevData) => [...prevData, currentWPM]);
      }
    }
  }, [startTime, userInput]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [testActive, userInput]);

  const generateText = () => {
    const selectedSentences = sentences[difficulty];
    let combinedText = "";
    while (combinedText.length < time * 10) {
      const randomIndex = Math.floor(Math.random() * selectedSentences.length);
      combinedText += selectedSentences[randomIndex] + " ";
    }
    setText(combinedText.trim());
  };

  const resetTest = () => {
    generateText();
    setTimeLeft(time);
    setTestActive(false);
    setUserInput("");
    setCursorPosition(0);
    setWpm(0);
    setAccuracy(100);
    setStartTime(null);
    setTypingData([]);
    setShowResults(false);
    onTestEnd(false);
  };

  const startTest = () => {
    if (!testActive) {
      setStartTime(Date.now());
      setTestActive(true);
      setTimeLeft(time);
      setTypingData([]);
      if (containerRef.current) containerRef.current.focus();
    }
  };

  const endTest = () => {
    setTestActive(false);
    clearInterval(intervalRef.current);

    const timeSpentInMinutes = (time - timeLeft) / 60;

    if (timeSpentInMinutes > 0) {
      const correctWords = userInput.split(" ").filter((word, index) => {
        const expectedWord = text.split(" ")[index];
        return word === expectedWord;
      }).length;

      const calculatedWpm = Math.round(correctWords / timeSpentInMinutes);
      setWpm(calculatedWpm);

      const correctChars = userInput
        .split("")
        .filter((char, index) => char === text[index]).length;
      const calculatedAccuracy =
        Math.round((correctChars / userInput.length) * 100) || 0;
      setAccuracy(calculatedAccuracy);
    } else {
      setWpm(0);
      setAccuracy(0);
    }

    updateTypingData(); // Ensure we have the final data point
    setShowResults(true);
    onTestEnd(true);
  };

  const handleKeyDown = (e) => {
    if (showResults) return;

    if (!testActive) {
      startTest();
    }

    if (e.key === "Backspace") {
      if (userInput.length > 0) {
        setUserInput((prevInput) => prevInput.slice(0, -1));
        setCursorPosition((prevPosition) => prevPosition - 1);
      }
    } else if (e.key.length === 1) {
      setUserInput((prevInput) => prevInput + e.key);
      setCursorPosition((prevPosition) => prevPosition + 1);
    }

    if (userInput.length >= text.length - 1) {
      endTest();
    }
  };

  const renderText = () => {
    return text.split("").map((char, index) => {
      let className = "text-gray-400";
      if (index < userInput.length) {
        className =
          userInput[index] === char ? "text-green-500" : "text-red-500";
      }
      return (
        <span key={index} className={`relative ${className}`}>
          {index === cursorPosition && (
            <span className="absolute left-0 top-0 h-full w-0.5 bg-white animate-blink"></span>
          )}
          {char}
        </span>
      );
    });
  };

  if (showResults) {
    return (
      <TestResults
        wpm={wpm}
        accuracy={accuracy}
        typingData={typingData}
        onRestart={resetTest}
      />
    );
  }

  return (
    <div className="mt-4">
      <div className="mb-4">
        <p className="text-xl mb-2">Time left: {timeLeft}s</p>
        <p className="text-lg mb-2">
          {testActive
            ? "Test in progress..."
            : "Start typing to begin the test"}
        </p>
      </div>
      <div
        ref={containerRef}
        className="mb-4 p-4 bg-gray-800 rounded outline-none h-48 overflow-y-auto"
        tabIndex={0}
      >
        <p className="text-lg mb-2 font-mono">{renderText()}</p>
      </div>
    </div>
  );
};

export default TypingTest;
