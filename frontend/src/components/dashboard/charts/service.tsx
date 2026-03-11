import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import api from "../../../api";
import type { ApexOptions } from "apexcharts";
import type {
  ServiceDataProps,
  ServiceSeriesProps,
  ServiceChartProps,
} from "../../../types/ChartsProps";
import { serviceMap } from "../../../types/ChartsProps";

const Service = ({
  filterParams,
  refreshCharts,
  serviceTooltipLoading,
  serviceTooltip,
  serviceTooltipCount,
  showCustomTooltip,
  serviceValue,
  serviceTypes,
}: ServiceChartProps) => {
  // Split the Material requests or hybrid seminar to two parts, so that the chart y axis labels will render a shorter y-axis title
  const serviceYAxis = serviceTypes.map((label) => {
    if (label === "Material Requests") {
      return ["Material", "Requests"];
    } else if (label === "Hybrid Seminar") {
      return ["Hybrid", "Seminar"];
    }
    return label;
  });

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      stackType: "100%",
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          dataLabels: {
            style: {
              fontSize: "12px",
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "13px",
              },
            },
          },
        },
      },
    ],
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
      categories: serviceYAxis,
    },
    yaxis: {
      show: serviceTypes.length > 0,
      labels: {
        style: {
          fontSize: "14px",
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
    tooltip: showCustomTooltip
      ? {
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
          <br/>
          Comments summarized: ${serviceTooltipCount[seriesIndex][dataPointIndex]}
        </div>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 8px 0;" />
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
          hideEmptySeries: false,
        }
      : {
          style: { fontSize: "14px" },
        },
    noData: {
      text: "No data available",
    },
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={serviceValue}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default Service;
