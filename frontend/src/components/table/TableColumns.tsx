import { ColumnDef } from "@tanstack/react-table";
import DropdownCell from "./DropdownCell";
import Dialog1 from "./TableDialog";
import FilterDropdown from "./FilterDropdown";
import { Table } from "@tanstack/react-table";

export type TableProps = {
  table: Table<SentimentPostType>;
};

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

export type SentimentPostType = {
  id: number;
  name: string;
  quarter: string;
  service: string;
  gender: Gender;
  feedback: string;
  sentiment: Sentiment;
};

//column definition array initialization, this is where tanstack is referencing from
export const getColumns = (
  isEditing: boolean
): ColumnDef<SentimentPostType, any>[] => [
  {
    accessorKey: "service_name",
    header: () => <span>Service Name</span>,
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
    enableColumnFilter: false,
  },
  {
    accessorKey: "service_type",
    header: () => <span>Service Type</span>,
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
    enableColumnFilter: false,
  },
  {
    accessorKey: "timestamp",
    header: () => <span>Timestamp</span>,
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
    enableColumnFilter: false,
  },
  {
    accessorKey: "quarter",
    header: ({ column }) => (
      <div className="ml-5 flex items-center justify-center gap-1">
        Quarter
        <FilterDropdown column={column} />
      </div>
    ),
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <div className="ml-5 flex items-center justify-center gap-1">
        Year
        <FilterDropdown column={column} />
      </div>
    ),
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
    enableColumnFilter: false,
  },
  {
    accessorKey: "sex",
    header: ({ column }) => (
      <div className="ml-5 flex items-center justify-center gap-1">
        Sex
        <FilterDropdown column={column} />
      </div>
    ),
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
    enableColumnFilter: false,
  },
  {
    accessorKey: "category",
    header: () => <span>Service Name</span>,
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
    enableColumnFilter: false,
  },
  {
    accessorKey: "typeoflibrary",
    header: () => <span>Type of Library</span>,
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
    enableColumnFilter: false,
  },
  {
    accessorKey: "region",
    header: () => <span>Region</span>,
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
    enableColumnFilter: false,
  },
  {
    accessorKey: "key_takeaways",
    header: () => <span>Key takeaways</span>,
    cell: (info) => <Dialog1 text={String(info.getValue())} />,
    enableColumnFilter: false,
    minSize: 74,
  },
  {
    accessorKey: "comments",
    header: () => <span>Comments</span>,
    cell: (info) => <Dialog1 text={String(info.getValue())} />,
    enableColumnFilter: false,
    minSize: 74,
  },
  {
    accessorKey: "suggestions",
    header: () => <span>Suggestions</span>,
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
    enableResizing: false,
  },
];
