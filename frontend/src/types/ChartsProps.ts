export type ChartProps = {
  filterParams: string;
  refreshCharts: number;
};
export type Sentiment = "Positive" | "Neutral" | "Negative";

export type GenderDataProps = {
  sex: "Female" | "Male";
  sentiment: Sentiment;
  sencount: number;
};

export type GenderSeriesProps = {
  name: string;
  data: number[];
};

export type GenderTooltipDataProps = {
  sex: "Female" | "Male";
  sentiment: Sentiment;
  summary: string;
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

export type ServiceSeriesProps = {
  name: string;
  data: number[];
};

export type ServiceTooltipDataProps = {
  service: Service;
  sentiment: Sentiment;
  summary: string;
};
