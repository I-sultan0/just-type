import React from "react";

const Navbar = ({ difficulty, setDifficulty }) => {
  const difficulties = ["Easy", "Medium", "Hard"];

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Typing Test</h1>
        <div>
          {difficulties.map((level) => (
            <button
              key={level}
              className={`ml-2 px-4 py-2 rounded ${
                difficulty === level.toLowerCase()
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => setDifficulty(level.toLowerCase())}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
