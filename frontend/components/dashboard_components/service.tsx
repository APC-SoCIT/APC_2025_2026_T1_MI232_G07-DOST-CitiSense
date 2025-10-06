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
  service: {
    neg: number;
    neu: number;
    pos: number;
  };
};

const SentimentByService = ({ services }: { services: ServiceType[] }) => {
  // Prepare data for Recharts
  const chartData = services.map((s) => ({
    name: s.name,
    Negative: s.service.neg,
    Neutral: s.service.neu,
    Positive: s.service.pos,
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Sentiment by Service
      </h3>
      <div className="w-full h-96">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              width={100}
            />
            <Tooltip
              formatter={(value: number) => `${value}%`}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend
              verticalAlign="top"
              align="center"
              wrapperStyle={{ fontSize: 12, marginBottom: 10 }}
            />
            <Bar dataKey="Negative" stackId="a" fill="#ef4444" />
            <Bar dataKey="Neutral" stackId="a" fill="#facc15" />
            <Bar dataKey="Positive" stackId="a" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentByService;
