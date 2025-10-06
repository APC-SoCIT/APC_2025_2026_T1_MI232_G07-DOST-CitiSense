"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ServiceType = {
  name: string;
  male: { neg: number; neu: number; pos: number };
  female: { neg: number; neu: number; pos: number };
  service: { neg: number; neu: number; pos: number };
};

const SentimentByGender = ({ services }: { services: ServiceType[] }) => {
  // Combine male and female sentiment values for the stacked bars
  const chartData = services.map((s) => ({
    name: s.name,
    Negative: s.male.neg + s.female.neg,
    Neutral: s.male.neu + s.female.neu,
    Positive: s.male.pos + s.female.pos,
    male: s.male,
    female: s.female,
  }));

  const barData = [
    { key: "Negative", color: "#ef4444" },
    { key: "Neutral", color: "#facc15" },
    { key: "Positive", color: "#22c55e" },
  ];

  // ✅ Custom Tooltip showing male/female breakdown
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length && payload[0].payload) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-md text-sm">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>

          <div className="space-y-1">
            <p className="text-red-500 font-medium">Negative</p>
            <p className="ml-2 text-gray-700">
              Male: {data.male.neg} | Female: {data.female.neg}
            </p>

            <p className="text-yellow-500 font-medium mt-1">Neutral</p>
            <p className="ml-2 text-gray-700">
              Male: {data.male.neu} | Female: {data.female.neu}
            </p>

            <p className="text-green-500 font-medium mt-1">Positive</p>
            <p className="ml-2 text-gray-700">
              Male: {data.male.pos} | Female: {data.female.pos}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => {
    const legendItems = [
      { value: "Negative", color: "#ef4444" },
      { value: "Neutral", color: "#facc15" },
      { value: "Positive", color: "#22c55e" },
    ];

    return (
      <ul
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {legendItems.map((entry, index) => (
          <li
            key={`legend-item-${index}`}
            style={{ margin: "0 10px", display: "flex", alignItems: "center" }}
          >
            <svg width="10" height="10" style={{ marginRight: 5 }}>
              <rect width="10" height="10" fill={entry.color} />
            </svg>
            <span style={{ color: "#333", fontSize: "12px" }}>
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 col-span-1 xl:col-span-2">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Overall Sentiment by Service
      </h3>
      <div className="w-full h-96">
        <ResponsiveContainer>
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 20, right: 40, left: 80, bottom: 20 }}
            barGap={0}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              domain={[0, "dataMax + 5"]}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              content={<CustomLegend />}
              verticalAlign="top"
              align="center"
              wrapperStyle={{
                marginBottom: 25,
              }}
            />

            {/* Stacked bar per service */}
            {barData.map((bar) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                stackId="a"
                fill={bar.color}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentByGender;
