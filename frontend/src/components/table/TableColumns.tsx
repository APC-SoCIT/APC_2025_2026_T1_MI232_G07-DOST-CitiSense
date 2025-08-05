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

export const getColumns = (isEditing: boolean) => [
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
    size: 160,
    header: () => <span>Sentiment</span>,
    cell: (info) => (
      <div className="h-[44px] min-w-[60px] px-2 py-1 flex items-center justify-center">
        {isEditing ? (
          <DropdownCell {...info} />
        ) : (
          (info.getValue() as Sentiment)
        )}
      </div>
    ),
    filterFn: "arrIncludesSome",
  },
];
