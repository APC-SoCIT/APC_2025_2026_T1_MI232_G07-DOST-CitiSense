export type Gender = "M" | "F";
export type Sentiment = "Positive" | "Negative" | "Neutral";
import { Table } from "@tanstack/react-table";

export type TableProps = {
  table: Table<SentimentPostType>;
};

export type SentimentOption = {
  label: Sentiment;
  color: string;
};

export const senArray: SentimentOption[] = [
  { label: "Positive", color: "bg-green-500" },
  { label: "Neutral", color: "bg-yellow-500" },
  { label: "Negative", color: "bg-red-500" },
];

export type SentimentPostType = {
  id: number;
  name: string;
  quarter: string;
  service_name: string;
  service_type: string;
  gender: Gender;
  feedback: string;
  sentiment: Sentiment;
};

export type filterOptions = {
  quarter: number[];
  service_type: string[];
  year: number[];
  sex: Gender;
  sentiment: Sentiment;
};
