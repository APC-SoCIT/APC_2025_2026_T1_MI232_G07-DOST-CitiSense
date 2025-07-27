import React from "react";
import ReactApexChart from "react-apexcharts";
import genderData from '../mockdata/gender.json'

const Gender = () => {
  const options = {
    chart: {
        type:'bar',
        height: 350,
        stacked: true,
        stackType: "100%",
    },
    plotOptions: {
        bar: {
            horizontal: true,
        },
    },
    title : {
        text: 'Sentiment by Gender'
    },
    xaxis: {
        categories: ["Female", "Male"],
    },
    yaxis: {
        labels: {
            style: {
            fontFamily: 'Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif',
            fontSize : '20px',
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
      <ReactApexChart options={options} series={genderData.series} type="bar" height={350} />
    </div>
  );
};

export default Gender;