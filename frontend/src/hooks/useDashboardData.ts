import React, { useEffect, useState } from "react";
import api from "../api";

type GenderSeries = {
  name: string;
  data: number[];
};

type ServiceSeries = {
  name: string;
  data: number[];
};

//TO BE REUSED OR DELETED SOMETIME IDK TBH

const useDashboardData = ({ filterParams }) => {
  const [genderValue, setGenderValue] = useState<GenderSeries[]>([]);
  const [serviceValue, setServiceValue] = useState<ServiceSeries[]>([]);
  const [gaugeValue, setGaugeValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<string | null>(null);

  useEffect(() => {
    //refresh states when on mount or remount
    setIsLoading(true);
    setIsError(null);

    const fetchDashboardData = async () => {
      const getGauge = async () => {
        const res = await api.get(`/sentimentposts/gauge/?${filterParams}`);
        const resData = res.data?.["Gauge percentage"]; // optional chaining proceeds through if res.data is not undefined
        if (typeof resData === "number") {
          //check if the value is a number
          return resData;
        }
        throw new Error("Invalid gauge data received");
      };

      const getGender = async () => {
        const res = await api.get(`/sentimentposts/gen/?${filterParams}`);
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
        return Object.entries(sentimentCounts).map(([sentiment, array]) => ({
          name: sentiment,
          data: array,
        }));
      };

      //map each service with a key for faster lookup
      const serviceMap = {
        "Hybrid Seminar": 0,
        "Material Requests": 1,
        "Online Library": 2,
        "Library Tour": 3,
      };

      const getService = async () => {
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
        resData.forEach((item) => {
          const index = serviceMap[item.service];
          if (index !== undefined) {
            serviceCounts[item.sentiment][index] = item.sencount;
          }
        });

        //maps through the modified serviceCounts and transforms it into a new array to pass onto the chart
        return Object.entries(serviceCounts).map(([sentiment, array]) => ({
          name: sentiment,
          data: array,
        }));
      };

      try {
        const [gaugeRes, genderRes, serviceRes] = await Promise.all([
          getGauge(),
          getGender(),
          getService(),
        ]);
        setGaugeValue(gaugeRes);
        setGenderValue(genderRes);
        setServiceValue(serviceRes);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setIsError("Failed to load data.");
        setGaugeValue(0);
        setGenderValue([]);
        setServiceValue([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return { gaugeValue, genderValue, serviceValue, isLoading, isError };
};
export default useDashboardData;
