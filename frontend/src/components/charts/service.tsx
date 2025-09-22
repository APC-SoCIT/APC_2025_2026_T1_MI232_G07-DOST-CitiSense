import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import serviceData from "../../mockdata/service.json";
import api from "../../api";
import { ApexOptions } from "apexcharts";
import { ChartProps, ResDataProps, ServiceDataProps } from "./chartprops";

type ServiceSeriesProps = {
  name: string;
  data: number[];
};
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

const Service = ({ filterParams }: ChartProps) => {
  const [serviceValue, setServiceValue] = useState<ServiceSeriesProps[]>([]);

  useEffect(() => {
    getService();
  }, [filterParams]);

  const getService = async () => {
    try {
      const res = await api.get(`/sentimentposts/service/?${filterParams}`);
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
      resData.forEach((item: ServiceDataProps) => {
        const index = serviceMap[item.service];
        if (index !== undefined) {
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

  const options: ApexOptions = {
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
      style: {
        fontSize: "20px",
        fontWeight: 600,
      },
      text: "Sentiment by Service",
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
          fontSize: "13px",
          fontWeight: 500,
        },
        offsetX: 4,
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#EA4228", "#d4ab57ff", "#4CAF50"],
    legend: {
      fontSize: "18px",
      fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 500,
      markers: {
        size: 8,
        offsetX: -5,
        offsetY: 0,
      },
      itemMargin: {
        horizontal: 10,
      },
    },
    dataLabels: {
      formatter: function (val: number) {
        return val.toFixed(1) + "%"; // show the 1st decimal
      },
      style: {
        fontSize: "15px",
        fontWeight: 530,
      },
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
      },
    },
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
