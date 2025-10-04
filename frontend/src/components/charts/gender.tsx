import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import api from "../../api";
import { ApexOptions } from "apexcharts";
import { ChartProps, ResDataProps } from "./chartprops";

type GenderSeriesProps = {
  name: string;
  data: number[];
};
//fallback for the chart data if no data is fetched or if data is undefined
const fallbackSeries = [
  { name: "Negative", data: [0, 0] },
  { name: "Neutral", data: [0, 0] },
  { name: "Positive", data: [0, 0] },
];

const Gender = ({ filterParams }: ChartProps) => {
  const [genderValue, setGenderValue] = useState<GenderSeriesProps[]>([]);

  useEffect(() => {
    getGender();
  }, [filterParams]);

  const getGender = async () => {
    try {
      const res = await api.get(`/sentimentposts/gen/?${filterParams}`);
      const resData = res.data.genderCount;
      console.log(res);
      console.log(resData);
      //temporary holder for sentiment counts per gender, this will hold the array for the series for the chart's y-axis
      //Index 0 = Female, Index 1 = Male
      let sentimentCounts = {
        Negative: [0, 0],
        Neutral: [0, 0],
        Positive: [0, 0],
      };

      // if the gender is "F" set index to 0; otherwise 1 ("M")
      resData.forEach((item: ResDataProps) => {
        const index = item.sex === "Female" ? 0 : 1;

        //get the current sentiment in the loop and determine the gender index
        //then put the following sentiment count to the appropriate position in the sentimentCounts
        sentimentCounts[item.sentiment][index] = item.sencount;
      });

      //transform data into key-value pair to pass onto the chart
      const genderSeries = Object.entries(sentimentCounts).map(
        ([sentiment, array]) => ({
          name: sentiment,
          data: array,
        })
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
      categories: ["Female", "Male"],
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
        series={genderValue.length > 0 ? genderValue : fallbackSeries}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default Gender;
