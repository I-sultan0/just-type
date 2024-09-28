import React from "react";

const TimeSelector = ({ time, setTime }) => {
  const times = [15, 30, 60];

  return (
    <div className="mb-4">
      {times.map((t) => (
        <button
          key={t}
          className={`mr-2 px-4 py-2 rounded ${
            time === t ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => setTime(t)}
        >
          {t}s
        </button>
      ))}
    </div>
  );
};

export default TimeSelector;
