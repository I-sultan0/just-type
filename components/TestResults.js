import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TestResults = ({ wpm, accuracy, typingData, onRestart }) => {
  // Filter out any potential undefined or NaN values
  const filteredData = typingData.filter(
    (value) => value !== undefined && !isNaN(value)
  );

  const chartData = {
    labels: filteredData.map((_, index) => index + 1),
    datasets: [
      {
        label: "WPM",
        data: filteredData,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Typing Speed Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Words Per Minute",
        },
      },
      x: {
        title: {
          display: true,
          text: "Time (seconds)",
        },
      },
    },
  };

  return (
    <div className="mt-4 w-full">
      <h2 className="text-2xl font-bold mb-4">Test Results</h2>
      <div className="mb-4">
        <p className="text-xl">WPM: {wpm}</p>
        <p className="text-xl">Accuracy: {accuracy}%</p>
      </div>
      {filteredData.length > 0 ? (
        <div className="mb-4 h-96 w-full">
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <p>No typing data available to display chart.</p>
      )}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        onClick={onRestart}
      >
        Restart Test
      </button>
    </div>
  );
};

export default TestResults;
