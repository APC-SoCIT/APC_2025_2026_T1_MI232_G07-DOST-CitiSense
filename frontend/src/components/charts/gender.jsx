import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import api from "../../api";

//fallback for the chart data if no data is fetched or if data is undefined
const fallbackSeries = [
  { name: "Negative", data: [0, 0] },
  { name: "Neutral", data: [0, 0] },
  { name: "Positive", data: [0, 0] },
];

const Gender = () => {
  const [genderValue, setGenderValue] = useState([]);

  useEffect(() => {
    getGender();
  }, []);

  const getGender = async () => {
    try {
      const res = await api.get("/sentimentposts/gen/");
      const resData = res.data.genderCount;

      //temporary holder for sentiment counts per gender, this will hold the array for the series for the chart's y-axis
      //Index 0 = Female, Index 1 = Male
      let sentimentCounts = {
        Negative: [0, 0],
        Neutral: [0, 0],
        Positive: [0, 0],
      };

      // if the gender is "F" set index to 0; otherwise 1 ("M")
      resData.forEach((item) => {
        const index = item.gender === "F" ? 0 : 1;

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
    colors: ["#EA4228", "#F5CD19", "#5BE12C"],
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
