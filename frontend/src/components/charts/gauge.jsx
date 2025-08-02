import React, { useEffect, useState } from "react";
import GaugeComponent from "react-gauge-component";
import api from "../../api";

const Gauge = () => {
  const [gaugeValue, setGaugeValue] = useState(0);

  useEffect(() => {
    getGauge();
  }, []);

  const getGauge = async () => {
    try {
      const res = await api.get("/sentimentposts/gauge/");
      const resData = res.data?.["Gauge percentage"]; // optional chaining proceeds through if res.data is not undefined
      if (typeof resData === "number") {
        //check if the value is a number
        setGaugeValue(resData);
      } else {
        console.error("Failed to fetch Gauge chart data", resData);
        setGaugeValue(0);
      }
    } catch (error) {
      console.error("Error fetching Gauge chart data:", error);
    }
  };

  return (
    <GaugeComponent
      className="flex items-center justify-center"
      value={gaugeValue}
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
  );
};

export default Gauge;
// import React from 'react';
// import GaugeChart from 'react-gauge-chart';
// import gaugeData from '../mockdata/gauge.json'

// const Gauge = () => {
//   return (
//     <div>
//       <GaugeChart id="gauge-chart1"
//         arcsLength={[0.33, 0.33, 0.33]}
//         colors={['#EA4228', '#F5CD19', '#5BE12C']}
//         percent={gaugeData.gauge / 100}
//         arcPadding={0.02}
//         textColor='#FFFFF'
//         style={{ width: '100%', height: '100%', maxWidth: '100%' }}
//         />
//     </div>
//   );
// };

// export default Gauge;
