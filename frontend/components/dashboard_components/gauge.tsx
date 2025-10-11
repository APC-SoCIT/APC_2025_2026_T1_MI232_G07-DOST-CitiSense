import GaugeComponent from "react-gauge-component";
import gaugeData from "../../mockdata/gauge.json";

const Gauge = () => {
  return (
    <div className="h-[500px] max-w-full rounded-md shadow-lg p-10 bg-white">
      <h3 className="font-semibold text-gray-800 text-2xl font-bold text-center mb-20">
        Overall Sentiment
      </h3>
      <div className="flex justify-center items-center h-[250px]">
        <div className="h-[330px] w-[300px]">
          <GaugeComponent
            value={gaugeData.gauge}
            type="radial"
            labels={{
              valueLabel: {
                style: {
                  fill: "#000000",
                  textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
                },
              },
              tickLabels: {
                type: "outer",
                ticks: [
                  { value: 20 },
                  { value: 40 },
                  { value: 60 },
                  { value: 80 },
                  { value: 100 },
                ],
              },
            }}
            arc={{
              colorArray: ["#EA4228", "#5BE12C"],
              subArcs: [{ limit: 33.3 }, { limit: 66.6 }, { limit: 100 }],
              padding: 0.02,
              width: 0.3,
            }}
            pointer={{
              elastic: true,
              animationDelay: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Gauge;
