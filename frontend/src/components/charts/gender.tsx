import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import api from "../../api";
import type { ApexOptions } from "apexcharts";
import type {
  GenderDataProps,
  GenderSeriesProps,
  GenderChartProps,
} from "../../types/ChartsProps";
import { genderMap } from "../../types/ChartsProps";

const Gender = ({
  filterParams,
  refreshCharts,
  genderTooltip,
  isGenderTooltipLoading,
  genderTooltipCount,
  showCustomTooltip,
  genderValue,
  genderTypes,
}: GenderChartProps) => {
  const genderYAxis = genderTypes.map((label) => {
    if (label.length > 16) {
      // If the label for the gender is more than 16 then split it into two parts.
      // The first index of the array being the first 6 letters of the word, and the other characters the second value of the array
      return [label.slice(0, 6), label.slice(6).trim()];
    }
    return label;
  });

  console.log("dd", genderValue);
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
      text: "Sentiment by Gender",
    },
    xaxis: {
      categories: genderYAxis,
    },
    yaxis: {
      show: genderValue.length > 0,
      labels: {
        style: {
          fontFamily: "Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif",
          fontSize: "15px",
          fontWeight: 10,
        },
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
          Comments summarized: ${genderTooltipCount[seriesIndex][dataPointIndex]}
        </div>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 8px 0;" />
          <div style="
            font-size: 14px;
            color: #6b7280;
            line-height: 1.5;
          ">
          ${isGenderTooltipLoading ? "Loading summary..." : genderTooltip[seriesIndex]?.[dataPointIndex] || "No summary available"}          
          </div>
        </div>
      </div>
    `;
          },
        }
      : {
          style: {
            fontSize: "14px",
          },
        },
    noData: {
      text: "No data available",
    },
  };
  return (
    <div>
      <ReactApexChart
        options={options}
        series={genderValue}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default Gender;
