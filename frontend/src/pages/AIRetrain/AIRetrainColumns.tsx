import type { ColumnDef } from "@tanstack/react-table";
import { type SentimentCorrection } from "@/types/AIRetrainProps";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import Dialog1 from "@/components/table/TableDialog";

export const getCorrectionColumns = (
  onDelete: (id: number) => void,
): ColumnDef<SentimentCorrection>[] => [
  {
    accessorKey: "comments",
    header: "Comments",
    cell: (info) => <Dialog1 text={String(info.getValue() ?? " ")} />,
  },
  {
    accessorKey: "original_sentiment",
    header: "Original Sentiment",
  },
  {
    accessorKey: "corrected_sentiment",
    header: "Corrected Sentiment",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: (info) => {
      const date = new Date(info.getValue() as string);
      return date.toLocaleString("en-PH");
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <Button
        type="button"
        variant="ghost"
        className="text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={() => onDelete(row.original.id)}
      >
        <Trash className="text-red-500" />
      </Button>
    ),
  },
];
