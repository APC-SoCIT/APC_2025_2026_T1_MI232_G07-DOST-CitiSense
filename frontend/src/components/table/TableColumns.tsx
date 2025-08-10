import { ColumnDef } from "@tanstack/react-table";
import DropdownCell from "./DropdownCell";
import Dialog1 from "./TableDialog";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import FilterDropdown from "./FilterDropdown";

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

//column definition array initialization, this is where tanstack is referencing from
export const getColumns = (isEditing: boolean): ColumnDef<Posttype, any>[] => [
  {
    accessorKey: "name",
    header: () => <span>Name</span>,
    cell: (info) => info.getValue(),
    enableColumnFilter: false,
  },
  {
    accessorKey: "service",
    header: ({ column }) => (
      <div className="ml-5 flex items-center justify-center gap-1">
        Service
        <FilterDropdown column={column} />
      </div>
    ),
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
    minSize: 100,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <div className="ml-5 flex items-center justify-center gap-1">
        Gender
        <FilterDropdown column={column} />
      </div>
    ),
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
    minSize: 100,
  },
  {
    accessorKey: "feedback",
    header: () => <span>Feedback</span>,
    cell: (info) => <Dialog1 text={String(info.getValue())} />,
    enableColumnFilter: false,
    minSize: 74,
  },
  {
    accessorKey: "sentiment",
    header: ({ column }) => (
      <div className="ml-5 flex items-center justify-center gap-1">
        Sentiment
        <FilterDropdown column={column} />
      </div>
    ),
    cell: (info) => (
      <div className="min-w-[60px] flex items-center justify-center">
        {isEditing ? (
          <DropdownCell {...info} />
        ) : (
          (info.getValue() as Sentiment)
        )}
      </div>
    ),
    filterFn: "arrIncludesSome",
    minSize: 77,
  },
];
