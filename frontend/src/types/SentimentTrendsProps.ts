export interface ChartProps {}

export interface SentimentTrendsDataPoint {
  date: string;
  sentiment: "Negative" | "Neutral" | "Positive";
  count: number;
}

export interface SentimentTrendsSeries {
  name: string;
  data: number[];
}

export interface SentimentTrendsApiResponse {
  trends: Array<{
    date: string;
    Positive: number;
    Neutral: number;
    Negative: number;
  }>;
}

export interface SentimentTrendsChartProps extends ChartProps {}
