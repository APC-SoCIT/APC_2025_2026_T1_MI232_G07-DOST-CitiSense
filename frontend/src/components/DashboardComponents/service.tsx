import ReactApexChart from "react-apexcharts";
import serviceData from "../../../mockdata/service.json";
import type { ApexOptions } from "apexcharts";

const Service = () => {
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
      categories: [
        "Hybrid Seminar",
        "Material Requests",
        "Online Library",
        "Library Tour",
      ],
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
    tooltip: {
      style: {
        fontSize: "12px",
      },
    },
  };

  return (
    <div className="h-[500px] max-w-full rounded-md shadow-lg p-10 bg-white">
      <ReactApexChart
        options={options}
        series={serviceData.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default Service;
