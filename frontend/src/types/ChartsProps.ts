export type Sentiment = "Positive" | "Neutral" | "Negative";

export type GaugeChartProps = {
  filterParams: string;
  refreshCharts: number;
};

export type GenderChartProps = {
  filterParams: string;
  refreshCharts: number;
  genderTooltip: string[][];
  isGenderTooltipLoading: boolean;
  genderTooltipCount: number[][];
};

export type ServiceChartProps = {
  filterParams: string;
  refreshCharts: number;
  serviceTooltip: string[][];
  serviceTooltipLoading: boolean;
  serviceTooltipCount: number[][];
};

//map each service with a key for faster lookup
export const serviceMap = {
  "Hybrid Seminar": 0,
  "Material Requests": 1,
  "Online Library": 2,
  "Library Tour": 3,
};

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
  count: number;
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
  count: number;
};
