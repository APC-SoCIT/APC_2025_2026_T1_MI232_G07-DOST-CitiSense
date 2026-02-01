import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import serviceData from "../../mockdata/service.json";
import api from "../../api";
import { ApexOptions } from "apexcharts";
import {
  ChartProps,
  ServiceDataProps,
  ServiceTooltipDataProps,
  ServiceSeriesProps,
} from "../../types/ChartsProps";

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

const Service = ({ filterParams, refreshCharts }: ChartProps) => {
  const [serviceValue, setServiceValue] = useState<ServiceSeriesProps[]>([]);
  const [serviceTooltip, setServiceTooltip] = useState<string[][]>([]);
  const [serviceTooltipLoading, setServiceTooltipLoading] =
    useState<boolean>(false);

  useEffect(() => {
    getService();
  }, [filterParams, refreshCharts]);

  useEffect(() => {
    getServiceTooltip();
  }, [filterParams]);

  const getServiceTooltip = async () => {
    try {
      setServiceTooltipLoading(true);

      const res = await api.get(
        `/sentimentposts/servicetooltip/?${filterParams}`,
      );
      const resData = res.data.serviceTooltip;

      // Used to store the current summary for each sentiment and each service category
      let serviceSummary = {
        Negative: ["", "", "", ""],
        Neutral: ["", "", "", ""],
        Positive: ["", "", "", ""],
      };

      // Transform the data, and put the each summary in their respective serviceSummary dictionary
      resData.forEach((item: ServiceTooltipDataProps) => {
        // Get the current index from the serviceMap
        const index = serviceMap[item.service];

        // Access the current sentiment within the loop in the serviceSumary dictionary, then use the index of the service to place the summary text
        // e.g., item.sentiment is 0 = Negative, the index is 0 = Hybrid Seminar. So serviceSummary["Negative"][0] = summary text
        serviceSummary[item.sentiment][index] = item.summary;
      });

      // Get only the values of the serviceSummary (not the key)
      const serviceTooltipObject = Object.values(serviceSummary);

      setServiceTooltip(serviceTooltipObject);
    } catch (error) {
      console.log(error);
    } finally {
      setServiceTooltipLoading(false);
    }
  };

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
        }),
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
        fontSize: "14px",
      },
      // Series index is the index for the row, data point index is the index for the column
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return `
      <div style="
        padding: 16px;
        max-width: 300px;
        width: 300px;
        white-space: initial;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      ">
        <div style="
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 8px;
          color: #333;
        ">
          ${w.globals.labels[dataPointIndex]} - 
          Value: ${w.globals.series[seriesIndex][dataPointIndex]}
        </div>
          <div style="
            font-size: 14px;
            color: #6b7280;
            line-height: 1.5;
          ">
          ${serviceTooltipLoading ? "Loading summary..." : serviceTooltip[seriesIndex]?.[dataPointIndex] || "No summary available"}          
          </div>
        </div>
      </div>
    `;
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
