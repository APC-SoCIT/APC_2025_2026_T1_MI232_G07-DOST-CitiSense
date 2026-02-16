import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import api from "../../api";
import type { ApexOptions } from "apexcharts";
import type {
  ServiceDataProps,
  ServiceSeriesProps,
  ServiceChartProps,
} from "../../types/ChartsProps";
import { serviceMap } from "../../types/ChartsProps";

//fallback data for chart, if no data fetched or undefined
const fallbackSeries = [
  { name: "Negative", data: [0, 0, 0, 0] },
  { name: "Neutral", data: [0, 0, 0, 0] },
  { name: "Positive", data: [0, 0, 0, 0] },
];

const Service = ({
  filterParams,
  refreshCharts,
  serviceTooltipLoading,
  serviceTooltip,
  serviceTooltipCount,
  showCustomTooltip,
  uniqueServiceType,
}: ServiceChartProps) => {
  const [serviceValue, setServiceValue] = useState<ServiceSeriesProps[]>([]);

  useEffect(() => {
    getService();
  }, [filterParams, refreshCharts, uniqueServiceType]);

  const getService = async () => {
    try {
      const res = await api.get(`/sentimentposts/service/?${filterParams}`);
      const resData = res.data.serviceCount;

      // Get the length of the serviceTypes array
      const size = uniqueServiceType.length;

      // Create a dictionary with key/value pair and assign each service type with its own value
      const dynamicServiceMap: Record<string, number> = {};
      uniqueServiceType.forEach((service: string, index: number) => {
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
      text: "Sentiment by Service",
    },
    xaxis: {
      categories: uniqueServiceType,
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "13px",
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
        }
      : {
          style: { fontSize: "14px" },
        },
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={serviceValue.length > 0 ? serviceValue : fallbackSeries}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default Service;
