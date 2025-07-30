import { ColumnDef } from "@tanstack/react-table";
import EditableCell from "./EditableCell";

type Gender = "M" | "F";
type Sentiment = "Positive" | "Negative" | "Neutral";

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
  },
  {
    accessorKey: "name",
    header: () => <span>name</span>,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "service",
    header: () => <span>service</span>,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "gender",
    header: () => <span>gender</span>,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "feedback",
    header: () => <span>feedback</span>,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "sentiment",
    header: () => <span>sentiment</span>,
    cell: EditableCell,
  },
];
