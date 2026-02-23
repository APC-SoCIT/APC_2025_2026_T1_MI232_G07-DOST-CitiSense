import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import api from "../../api";
import type {
  SentimentTrendsDataProps,
  SentimentTrendsChartsProps,
} from "../../types/ChartsProps";
import { generateFakeData } from "../../mockdata/fakeSentimentTrends";

const SentimentTrends: React.FC<SentimentTrendsChartsProps> = ({
  filterParams,
  refreshCharts,
}) => {
  const [trendsValue, setTrendsValue] = useState<SentimentTrendsDataProps[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<string | null>(null);
  const seriesOrder = ["Neutral", "Negative", "Positive"];
  useEffect(() => {
    const fetchSentimentTrendsData = async () => {
      setIsLoading(true);
      setIsError(null);
      try {
        const response = await api.get(
          `sentimentposts/areachart/?${filterParams}`,
        );

        const responseData: SentimentTrendsDataProps[] =
          response.data.areaCount;

        // Convert the response array to always be Neutral first, then Negative, and lastly Positive
        // Reference: https://stackoverflow.com/a/44063445
        const responseDataSorted = responseData
          .filter((item) => seriesOrder.includes(item.name))
          .toSorted(
            (a, b) => seriesOrder.indexOf(a.name) - seriesOrder.indexOf(b.name),
          );

        // setTrendsValue(generateFakeData());
        setTrendsValue(responseDataSorted);
        console.log("This is the sentiment trends data", responseDataSorted);
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
      type: "line",
      stacked: false,
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
    colors: ["#d4ab57ff", "#EA4228", "#4CAF50"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
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
      crosshairs: {
        show: true,
        position: "front",
      },
    },
    yaxis: {
      show: trendsValue.length > 0,
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
      followCursor: true,
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
    noData: {
      text: "No data available",
    },
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="w-full px-10">
      {isError && <div className="text-red-500 text-sm mb-2">{isError}</div>}
      <ReactApexChart
        options={options}
        series={trendsValue}
        type="line"
        height={"350px"}
      />
    </div>
  );
};

export default SentimentTrends;
