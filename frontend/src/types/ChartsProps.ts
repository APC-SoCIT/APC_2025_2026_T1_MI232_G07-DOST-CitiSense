export type ChartProps = {
  filterParams: string;
  refreshCharts: number;
};
export type Sentiment = "Positive" | "Neutral" | "Negative";

export type ResDataProps = {
  sex: "Female" | "Male";
  sentiment: Sentiment;
  sencount: number;
};

type Service =
  | "Hybrid Seminar"
  | "Material Requests"
  | "Online Library"
  | "Library Tour";

export type ServiceDataProps = {
  service: Service;
  sentiment: Sentiment;
  sencount: number;
};
