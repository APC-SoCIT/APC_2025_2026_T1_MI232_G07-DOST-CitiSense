import type { ColumnDef } from "@tanstack/react-table";
import DropdownCell from "../../components/table/DropdownCell";
import Dialog1 from "../../components/table/TableDialog";
import FilterDropdown from "../../components/table/FilterDropdown";
import type {
  SentimentPostType,
  filterOptions,
} from "../../types/TableColumnProps";
import type { Sentiment } from "../../types/ChartsProps";

//column definition array initialization, this is where tanstack data table is referencing from
export const getColumns = (
  isEditing: boolean,
  filterOptions: filterOptions,
): ColumnDef<SentimentPostType, any>[] => [
  {
    accessorKey: "service_name",
    header: ({ column }) => (
      <div className="ml-5 flex items-center justify-center gap-1">
        Service Name
        <FilterDropdown
          column={column}
          options={filterOptions.service_name || []}
        />
      </div>
    ),
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
    enableColumnFilter: false,
  },
  {
    accessorKey: "service_type",
    header: ({ column }) => (
      <div className="ml-5 flex items-center justify-center gap-1">
        Service Type
        <FilterDropdown
          column={column}
          options={filterOptions.service_type || []}
        />
      </div>
    ),
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
    enableColumnFilter: true,
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
        <FilterDropdown column={column} options={filterOptions.quarter || []} />
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
        <FilterDropdown column={column} options={filterOptions.year || []} />
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
        <FilterDropdown column={column} options={filterOptions.sex || []} />
      </div>
    ),
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
    enableColumnFilter: false,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <div className="ml-5 flex items-center justify-center gap-1">
        Category
        <FilterDropdown
          column={column}
          options={filterOptions.category || []}
        />
      </div>
    ),
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
    enableColumnFilter: false,
  },
  {
    accessorKey: "typeoflibrary",
    header: ({ column }) => (
      <div className="ml-5 flex items-center justify-center gap-1">
        Type of Library
        <FilterDropdown
          column={column}
          options={filterOptions.typeoflibrary || []}
        />
      </div>
    ),
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
    enableColumnFilter: false,
  },
  {
    accessorKey: "region",
    header: ({ column }) => (
      <div className="ml-5 flex items-center justify-center gap-1">
        Region
        <FilterDropdown column={column} options={filterOptions.region || []} />
      </div>
    ),
    cell: (info) => info.getValue(),
    filterFn: "arrIncludesSome",
    enableColumnFilter: false,
  },
  {
    accessorKey: "key_takeaways",
    header: () => <span>Key takeaways</span>,
    cell: (info) => <Dialog1 text={String(info.getValue() ?? " ")} />,
    enableColumnFilter: false,
    minSize: 74,
  },
  {
    accessorKey: "comments",
    header: () => <span>Comments</span>,
    cell: (info) => <Dialog1 text={String(info.getValue() ?? " ")} />,
    enableColumnFilter: false,
    minSize: 74,
  },
  {
    accessorKey: "suggestions",
    header: () => <span>Suggestions</span>,
    cell: (info) => <Dialog1 text={String(info.getValue() ?? " ")} />,
    enableColumnFilter: false,
    minSize: 74,
  },
  {
    accessorKey: "sentiment",
    header: ({ column }) => (
      <div className="ml-5 flex items-center justify-center gap-1">
        Sentiment
        <FilterDropdown
          column={column}
          options={filterOptions.sentiment || []}
        />
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
