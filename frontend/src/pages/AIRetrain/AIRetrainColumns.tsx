import type { ColumnDef } from "@tanstack/react-table";
import { type SentimentCorrection } from "@/types/AIRetrainProps";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import Dialog1 from "@/components/table/TableDialog";

export const getCorrectionolumns: ColumnDef<SentimentCorrection>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
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
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <Button
        type="button"
        variant="ghost"
        onClick={() => alert(`Delete: ${row.original.id}`)}
      >
        <Trash />
      </Button>
    ),
  },
];
