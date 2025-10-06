// 1. Overall Sentiment Gauge Component
const OverallSentimentGauge = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 col-span-1">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Overall Sentiment
      </h3>
      <div className="relative w-48 h-48 mx-auto">
        {/* SVG Gauge Implementation */}
        <svg viewBox="0 0 200 120" className="w-full">
          {/* Background Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="40"
          />
          {/* Negative Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 60 31"
            fill="none"
            stroke="#ef4444"
            strokeWidth="40"
          />
          {/* Neutral Track */}
          <path
            d="M 60 31 A 80 80 0 0 1 140 31"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="40"
          />
          {/* Positive Track */}
          <path
            d="M 140 31 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#10b981"
            strokeWidth="40"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <div className="text-4xl font-bold text-gray-900">72%</div>
        </div>
      </div>
      <div className="mt-6 space-y-2">
        {[
          { label: "Negative", color: "bg-red-500", value: "12%" },
          { label: "Neutral", color: "bg-amber-500", value: "16%" },
          { label: "Positive", color: "bg-green-500", value: "72%" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-gray-600">{item.label}</span>
            </span>
            <span className="text-gray-800 font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverallSentimentGauge;
