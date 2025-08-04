import { ColumnDef } from "@tanstack/react-table";
import DropdownCell from "./DropdownCell";

type Gender = "M" | "F";
type Sentiment = "Positive" | "Negative" | "Neutral";

export type SentimentOption = {
  label: Sentiment;
  color: string;
};

export const senArray: SentimentOption[] = [
  { label: "Positive", color: "bg-green-500" },
  { label: "Neutral", color: "bg-yellow-500" },
  { label: "Negative", color: "bg-red-500" },
];

export type Posttype = {
  id: number;
  name: string;
  service: string;
  gender: Gender;
  feedback: string;
  sentiment: Sentiment;
};

export const columns: ColumnDef<Posttype>[] = [
  {
    accessorKey: "id",
    header: () => <span>ID</span>,
    cell: (info) => info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: "name",
    header: () => <span>Name</span>,
    cell: (info) => info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: "service",
    header: () => <span>Service</span>,
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "gender",
    header: () => <span>Gender</span>,
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "feedback",
    header: () => <span>Feedback</span>,
    cell: (info) => info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: "sentiment",
    header: () => <span>Sentiment</span>,
    cell: DropdownCell,
    filterFn: "arrIncludesSome",
  },
];
