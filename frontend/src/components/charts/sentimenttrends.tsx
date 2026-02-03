import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import axios from "axios";

const fallbackSeries = [
  { name: "Negative", data: [0, 0, 0, 0, 0, 0, 0] },
  { name: "Neutral", data: [0, 0, 0, 0, 0, 0, 0] },
  { name: "Positive", data: [0, 0, 0, 0, 0, 0, 0] },
];

interface SentimentTrendsProps {
  filterParams?: string;
  refreshCharts?: number;
}

const SentimentTrends: React.FC<SentimentTrendsProps> = () => {
  const [series, setSeries] = useState(fallbackSeries);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(null);
      try {
        const response = await axios.get("/api/sentimentposts/trends/");
        const apiData = response.data?.trends;
        if (Array.isArray(apiData) && apiData.length > 0) {
          const mapped = ["Negative", "Neutral", "Positive"].map(
            (sentiment) => {
              const found = apiData.find(
                (item) => item.sentiment === sentiment,
              );
              return {
                name: sentiment,
                data:
                  found && Array.isArray(found.data)
                    ? found.data
                    : [0, 0, 0, 0, 0, 0, 0],
              };
            },
          );
          setSeries(mapped);
        } else {
          setSeries(fallbackSeries);
        }
      } catch (err) {
        setIsError("Failed to fetch sentiment trends data.");
        setSeries(fallbackSeries);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "area",
      stacked: true,
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,
          zoom: false,
          zoomin: true,
          zoomout: true,
          reset: false,
          pan: false,
          selection: false,
        },
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
    colors: ["#EA4228", "#d4ab57ff", "#4CAF50"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
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
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: {
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
      borderColor: "#e2e8f0",
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
      x: {
        formatter: (val) => `Day: ${val}`,
      },
      y: {
        formatter: (value) => `${value} posts`,
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
    <div className="w-full">
      {isError && <div className="text-red-500 text-sm mb-2">{isError}</div>}
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default SentimentTrends;
