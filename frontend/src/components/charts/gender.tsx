import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import api from "../../api";
import { ApexOptions } from "apexcharts";
import {
  GenderDataProps,
  GenderSeriesProps,
  GenderChartProps,
  genderMap,
} from "../../types/ChartsProps";

//fallback for the chart data if no data is fetched or if data is undefined
const fallbackSeries = [
  { name: "Negative", data: [0, 0, 0] },
  { name: "Neutral", data: [0, 0, 0] },
  { name: "Positive", data: [0, 0, 0] },
];

const Gender = ({
  filterParams,
  refreshCharts,
  genderTooltip,
  isGenderTooltipLoading,
  genderTooltipCount,
  showCustomTooltip,
}: GenderChartProps) => {
  const [genderValue, setGenderValue] = useState<GenderSeriesProps[]>([]);

  useEffect(() => {
    getGender();
  }, [filterParams, refreshCharts]);

  const getGender = async () => {
    try {
      const res = await api.get(`/sentimentposts/gen/?${filterParams}`);
      const resData = res.data.genderCount;
      console.log(res);
      console.log(resData);

      //temporary holder for sentiment counts per gender, this will hold the array for the series for the chart's y-axis
      //Index 0 = Female, Index 1 = Male
      let sentimentCounts = {
        Negative: [0, 0, 0],
        Neutral: [0, 0, 0],
        Positive: [0, 0, 0],
      };

      // if the gender is "F" set index to 0; otherwise 1 ("M")
      resData.forEach((item: GenderDataProps) => {
        const index = genderMap[item.sex];

        //get the current sentiment in the loop and determine the gender index
        //then put the following sentiment count to the appropriate position in the sentimentCounts
        sentimentCounts[item.sentiment][index] = item.sencount;
      });

      //transform data into key-value pair to pass onto the chart
      const genderSeries = Object.entries(sentimentCounts).map(
        ([sentiment, array]) => ({
          name: sentiment,
          data: array,
        }),
      );

      setGenderValue(genderSeries);
    } catch (error) {
      console.error("Error fetching Gender chart data:", error);
      setGenderValue([]);
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
      text: "Sentiment by Gender",
    },
    xaxis: {
      categories: ["Female", "Male", ["Prefer not", "to say"]],
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: "Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif",
          fontSize: "20px",
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
            console.log(
              "This is the gendertooltip seriesindex",
              genderTooltip[seriesIndex][dataPointIndex],
            );

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
  };
  return (
    <div>
      <ReactApexChart
        options={options}
        series={genderValue.length > 0 ? genderValue : fallbackSeries}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default Gender;
