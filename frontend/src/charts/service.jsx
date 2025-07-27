import React from "react";
import ReactApexChart from "react-apexcharts";
import serviceData from "../mockdata/service.json"

const Service = () => {
  const options = {
    chart: {
        type:'bar',
        height: 350,
        stacked: true,
        stackType: "100%"
    },
    plotOptions: {
        bar: {
            horizontal: true,
        },
    },
    title : {
        text: 'Sentiment by Service',
        textSize: '20px'
    },
    xaxis: {
        categories: ["Hybrid Seminar", "Material Requests", "Online Library", "Physical Library"]
    },
    yaxis: {
        labels: {
            style: {
            fontFamily: 'Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif',
            fontSize : '13px',
            fontWeight: 10
            }
        }
    },
    fill: {
        opacity: 1,
    },
    colors: ['#EA4228', '#F5CD19', '#5BE12C']
  };

  return (
    <div>
      <ReactApexChart options={options} series={serviceData.series} type="bar" height={350} />
    </div>
  );
};

export default Service;