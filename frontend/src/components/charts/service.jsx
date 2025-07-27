import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import serviceData from "../../mockdata/service.json";
import api from "../../api";

//fallback data for chart, if no data fetched or undefined
const fallbackSeries = [
  { name: "Negative", data: [0, 0, 0, 0] },
  { name: "Neutral", data: [0, 0, 0, 0] },
  { name: "Positive", data: [0, 0, 0, 0] },
];

//map each service with a key for faster lookup
const serviceMap = {
  "Hybrid Seminar": 0,
  "Material Requests": 1,
  "Online Library": 2,
  "Library Tour": 3,
};

const Service = () => {
  const [serviceValue, setServiceValue] = useState([]);

  useEffect(() => {
    getService();
  }, []);

  const getService = async () => {
    try {
      const res = await api.get("/sentimentposts/service/");
      const resData = res.data.serviceCount;

      //used to temporarily store the current object needed for the chart data
      //this object contains the sentiment count per service in each sentiment category
      let serviceCounts = {
        Negative: [0, 0, 0, 0],
        Neutral: [0, 0, 0, 0],
        Positive: [0, 0, 0, 0],
      };

      //loop for updating the serviceCounts based on the serviceMap
      //looks for the value pair of the current index and assigns it as the current index
      resData.forEach((item) => {
        const index = serviceMap[item.service];
        if(index !== undefined) {
          serviceCounts[item.sentiment][index] = item.sencount;
        } 
      });
      
      //maps through the modified serviceCounts and transforms it into a new array to pass onto the chart
      const serviceSeries = Object.entries(serviceCounts).map(
        ([sentiment, array]) => ({
          name: sentiment,
          data: array,
        })
      );

      setServiceValue(serviceSeries);

    } catch (error) {
      console.error("Error fetching Service chart data:", error);
      setServiceValue([]);
    }
  };
  
  const options = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      stackType: "100%",
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    title: {
      text: "Sentiment by Service",
      textSize: "20px",
    },
    xaxis: {
      categories: [
        "Hybrid Seminar",
        "Material Requests",
        "Online Library",
        "Library Tour",
      ],
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: "Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif",
          fontSize: "13px",
          fontWeight: 10,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#EA4228", "#F5CD19", "#5BE12C"],
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={serviceValue.length > 0 ? serviceValue : fallbackSeries}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default Service;
