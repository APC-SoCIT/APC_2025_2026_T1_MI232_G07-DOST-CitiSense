import { useEffect, useState } from "react";
import GaugeComponent from "react-gauge-component";
import api from "../../../api";
import type { GaugeChartProps } from "../../../types/ChartsProps";

const Gauge = ({ gaugeValue }: GaugeChartProps) => {
  return (
    <div>
      <h1 className="font-sans font-bold text-center mb-5 mt-10 text-xl">
        Overall Sentiment
      </h1>
      <GaugeComponent
        className="flex items-center justify-center"
        value={gaugeValue}
        type="radial"
        labels={{
          valueLabel: {
            style: {
              fill: "#000000",
              textShadow: "0 0 2px rgba(0, 0, 0, 0.25)",
              fontWeight: 400,
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
          colorArray: ["#EA4228", "#e7c073ff", "#4CAF50"],
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
  );
};

export default Gauge;
