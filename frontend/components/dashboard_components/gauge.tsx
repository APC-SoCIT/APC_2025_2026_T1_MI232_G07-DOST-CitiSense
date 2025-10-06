"use client";

import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Negative", value: 12, fill: "#ef4444" },
  { name: "Neutral", value: 16, fill: "#f59e0b" },
  { name: "Positive", value: 72, fill: "#10b981" },
];

const OverallSentimentGauge = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Overall Sentiment
      </h3>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="70%"
            innerRadius="50%"
            outerRadius="100%"
            barSize={20}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar background dataKey="value" />
            <Legend
              iconSize={10}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center mt-4">
        <div className="text-4xl font-bold text-gray-900">72%</div>
        <p className="text-sm text-gray-500">Overall Positive Sentiment</p>
      </div>
    </div>
  );
};

export default OverallSentimentGauge;
