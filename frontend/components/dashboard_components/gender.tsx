import ReactApexChart from "react-apexcharts";
import genderData from "../../mockdata/gender.json";

const Gender = () => {
  const options = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      stackType: "100%",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
      },
    },
    title: {
      text: "Sentiment by Gender",
      style: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#1f2937",
      },
    },
    xaxis: {
      categories: ["Female", "Male"],
      labels: {
        formatter: (val: number) => `${val}%`,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: "Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif",
          fontSize: "16px",
          fontWeight: 500,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      style: {
        fontSize: "12px",
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      fontSize: "14px",
    },
    colors: ["#EA4228", "#F5CD19", "#5BE12C"],
  };

  return (
    <div className="h-[500px] max-w-full rounded-md shadow-lg p-10 bg-white">
      <ReactApexChart
        options={options}
        series={genderData.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default Gender;
