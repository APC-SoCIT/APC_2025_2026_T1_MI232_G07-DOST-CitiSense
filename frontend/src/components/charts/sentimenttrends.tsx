import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import axios from "axios";
import api from "../../api";
import {
  SentimentTrendsDataProps,
  SentimentTrendsChartsProps,
} from "../../types/ChartsProps";
import { generateFakeData } from "../../mockdata/fakeSentimentTrends";

const fallbackSeries = [
  { name: "Negative", data: [0, 0, 0, 0, 0, 0, 0] },
  { name: "Neutral", data: [0, 0, 0, 0, 0, 0, 0] },
  { name: "Positive", data: [0, 0, 0, 0, 0, 0, 0] },
];

const SentimentTrends: React.FC<SentimentTrendsChartsProps> = ({
  filterParams,
  refreshCharts,
}) => {
  const [trendsValue, setTrendsValue] = useState<SentimentTrendsDataProps[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentimentTrendsData = async () => {
      setIsLoading(true);
      setIsError(null);
      try {
        const response = await api.get(
          `sentimentposts/areachart/?${filterParams}`,
        );
        const responseData = response.data.areaCount;

        // setTrendsValue(generateFakeData());
        setTrendsValue(responseData);
      } catch (err) {
        console.log(err);
        setIsError("Failed to fetch sentiment trends data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSentimentTrendsData();
  }, [filterParams, refreshCharts]);

  const options: ApexOptions = {
    chart: {
      type: "area",
      stacked: true,
      toolbar: {
        show: true,
        tools: {
          download: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          reset: true,
          selection: true,
        },
      },
      zoom: {
        enabled: true,
        type: "x",
        autoScaleYaxis: true,
      },
      animations: {
        enabled: true,
        speed: 800,
      },
      fontFamily: "Inter, system-ui, sans-serif",
    },
    title: {
      text: "Sentiment Trends",
      align: "left",

      style: {
        fontSize: "20px",
        fontWeight: 600,
      },
    },
    colors: ["#4CAF50", "#EA4228", "#d4ab57ff"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "monotoneCubic",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: true,
        style: {
          colors: "#64748b",
          fontSize: "12px",
          fontWeight: 500,
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: 0,
      title: {
        text: "Sentiment Count",
        style: {
          color: "#64748b",
          fontSize: "12px",
          fontWeight: 600,
        },
      },
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
        },
        formatter: (value) => Math.round(value).toString(),
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "18px",
      fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 500,
      markers: {
        shape: "square",
        size: 8,
        offsetX: -5,
        offsetY: 0,
      },
      itemMargin: {
        horizontal: 10,
      },
    },
    grid: {
      borderColor: "#adb4be",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 10,
        bottom: 0,
        left: 10,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: "light",
      style: {
        fontSize: "12px",
      },
      x: { format: "dd MMM yy" },
      y: {
        formatter: (value) => `${value} post(s)`,
        title: {
          formatter: (seriesName) => `${seriesName}:`,
        },
      },
      marker: {
        show: true,
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "center",
          },
          yaxis: {
            title: {
              text: undefined,
            },
          },
        },
      },
    ],
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="w-full px-10">
      {isError && <div className="text-red-500 text-sm mb-2">{isError}</div>}
      <ReactApexChart
        options={options}
        series={trendsValue.length > 0 ? trendsValue : fallbackSeries}
        type="area"
        height={"350px"}
      />
    </div>
  );
};

export default SentimentTrends;
