// 3. Sentiment by Service Component
// Define ServiceType if not imported
type ServiceType = {
  name: string;
  service: {
    neg: number;
    neu: number;
    pos: number;
  };
};

const SentimentByService = ({ services }: { services: ServiceType[] }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Sentiment by Service
      </h3>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-4 text-xs">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-400"></div>
            <span className="text-gray-600">Negative</span>
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-400"></div>
            <span className="text-gray-600">Neutral</span>
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-cyan-400"></div>
            <span className="text-gray-600">Positive</span>
          </span>
        </div>
        {services.map((service, idx) => (
          <div key={idx} className="space-y-2">
            <div className="text-xs text-gray-700 font-medium">
              {service.name}
            </div>
            <div className="flex h-7 rounded-full overflow-hidden bg-gray-200">
              <div
                style={{ width: `${service.service.neg}%` }}
                className="bg-red-400"
              ></div>
              <div
                style={{ width: `${service.service.neu}%` }}
                className="bg-yellow-400"
              ></div>
              <div
                style={{ width: `${service.service.pos}%` }}
                className="bg-cyan-400"
              ></div>
            </div>
          </div>
        ))}
        <div className="flex justify-between text-xs text-gray-400 pt-2">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
  // removed stray closing brace
};

export default SentimentByService;
