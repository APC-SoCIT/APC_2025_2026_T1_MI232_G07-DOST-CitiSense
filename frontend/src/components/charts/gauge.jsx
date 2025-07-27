import React from "react";
import GaugeComponent from "react-gauge-component";
import gaugedata from  '../../mockdata/gauge.json';

const Gauge = () => {
  return(
    <div>
      <GaugeComponent
        value={gaugedata.gauge}
        type="radial"
        labels={{
          valueLabel: {
            style: {fill: "#000000", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)"}
          },
          tickLabels: {
            type: "outer",
            ticks: [
              { value: 20 },
              { value: 40 },
              { value: 60 },
              { value: 80 },
              { value: 100 }
            ],
          }
        }}
        arc={{
          colorArray: ['#EA4228','#5BE12C'],
          subArcs: [{limit: 33.3}, {limit: 66.6}, {limit: 100}],
          padding: 0.02,
          width: 0.3
        }}
        pointer={{
          elastic: true,
          animationDelay: 0
        }}
      />
    </div>
  )
}

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