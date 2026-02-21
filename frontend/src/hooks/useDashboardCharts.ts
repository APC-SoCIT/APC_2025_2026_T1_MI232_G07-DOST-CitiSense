import React, { useEffect, useState } from "react";
import api from "../api";
import type {
  GenderDataProps,
  GenderSeriesProps,
  ServiceDataProps,
  ServiceSeriesProps,
} from "../types/ChartsProps";

export type useDashboardChartsProps = {
  filterParams: string;
  refreshCharts: number;
};
const useDashboardCharts = ({
  filterParams,
  refreshCharts,
}: useDashboardChartsProps) => {
  const [gaugeValue, setGaugeValue] = useState(0);
  const [genderValue, setGenderValue] = useState<GenderSeriesProps[]>([]);
  const [genderTypes, setGenderTypes] = useState<string[]>([]);
  const [serviceValue, setServiceValue] = useState<ServiceSeriesProps[]>([]);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);

  useEffect(() => {
    getGauge();
    getGender();
    getService();
  }, [filterParams, refreshCharts]);

  const getGauge = async () => {
    try {
      const res = await api.get(`/sentimentposts/gauge/?${filterParams}`);
      const resData = res.data?.["Gauge percentage"]; // optional chaining proceeds through if res.data is not undefined
      if (typeof resData === "number") {
        //check if the value is a number
        setGaugeValue(resData);
      } else {
        console.error("Failed to fetch Gauge chart data", resData);
        setGaugeValue(0);
      }
    } catch (error) {
      console.error("Error fetching Gauge chart data:", error);
    }
  };

  const getGender = async () => {
    try {
      const res = await api.get(`/sentimentposts/gen/?${filterParams}`);
      const resData = res.data.genderCount;

      // If there is no data from the api response just break from the function early and exit with no values inside the array
      if (!resData || resData.length === 0) {
        setGenderValue([]);
        setGenderTypes([]);
        return;
      }
      // Get the unique genders for rendering the y-axis of the chart
      const uniqueGenderArray: string[] = Array.from(
        new Set(resData.map((item: GenderDataProps) => item.sex)),
      );

      setGenderTypes(uniqueGenderArray);

      const size = uniqueGenderArray.length;

      // Create a dictionary with key/value pair and assign each gender type with its own value
      const dynamicGenderMap: Record<string, number> = {};
      uniqueGenderArray.forEach((sex: string, index: number) => {
        dynamicGenderMap[sex] = index;
      });

      //temporary holder for sentiment counts per gender, this will hold the array for the series for the chart's y-axis
      let sentimentCounts = {
        Negative: Array(size).fill(0),
        Neutral: Array(size).fill(0),
        Positive: Array(size).fill(0),
      };

      // if the gender is "F" set index to 0; otherwise 1 ("M")
      resData.forEach((item: GenderDataProps) => {
        const index = dynamicGenderMap[item.sex];

        //get the current sentiment in the loop and determine the gender index
        //then put the following sentiment count to the appropriate position in the sentimentCounts
        if (index !== undefined) {
          sentimentCounts[item.sentiment][index] = item.sencount;
        }
      });

      //transform data into key-value pair to pass onto the chart
      const genderSeries = Object.entries(sentimentCounts).map(
        ([sentiment, array]) => ({
          name: sentiment,
          data: array,
        }),
      );

      setGenderValue(genderSeries);
      console.log(genderSeries);
    } catch (error) {
      console.error("Error fetching Gender chart data:", error);
      setGenderValue([]);
    }
  };

  const getService = async () => {
    try {
      const res = await api.get(`/sentimentposts/service/?${filterParams}`);
      const resData = res.data.serviceCount;

      // If there is no data from the api response just break from the function early and exit with no values inside the array
      if (!resData || resData.length === 0) {
        setServiceValue([]);
        setServiceTypes([]);
        return;
      }

      // Get the unique service names for rendering the y-axis of the chart
      const uniqueServiceTypesArray: string[] = Array.from(
        new Set(resData.map((item: ServiceDataProps) => item.service)),
      );

      setServiceTypes(uniqueServiceTypesArray);

      // Get the length of the serviceTypes array
      const size = uniqueServiceTypesArray.length;

      // Create a dictionary with key/value pair and assign each service type with its own value
      const dynamicServiceMap: Record<string, number> = {};
      uniqueServiceTypesArray.forEach((service: string, index: number) => {
        dynamicServiceMap[service] = index;
      });

      //used to temporarily store the current object needed for the chart data
      //this object contains the sentiment count per service in each sentiment category
      // Reference: https://stackoverflow.com/a/44172015 - create an array filled with zeroes based on the serviceType count
      let serviceCounts = {
        Negative: Array(size).fill(0),
        Neutral: Array(size).fill(0),
        Positive: Array(size).fill(0),
      };

      //loop for updating the serviceCounts based on the serviceMap
      //looks for the value pair of the current index and assigns it as the current index
      resData.forEach((item: ServiceDataProps) => {
        const index = dynamicServiceMap[item.service];
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
  return {
    gaugeValue,
    genderValue,
    genderTypes,
    serviceValue,
    serviceTypes,
  };
};

export default useDashboardCharts;
