import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { type ModelVersion } from "@/types/ModelSelectionProps";
import { Link } from "react-router-dom";

export const getModelColumns = (
  onActivate: (id: number) => void,
): ColumnDef<ModelVersion>[] => [
  {
    accessorKey: "version_name",
    header: "Version",
    cell: ({ row }) => (
      <Button asChild variant="ghost" className="w-full">
        <Link to={`/ai/models/${row.original.id}`}>
          {row.original.version_name}
        </Link>
      </Button>
    ),
  },
  {
    accessorKey: "samples_used",
    header: "Samples Used",
  },
  {
    id: "accuracy",
    header: "Accuracy",
    cell: ({ row }) => {
      const acc = row.original.eval_results?.eval_accuracy;
      return acc !== undefined ? `${(acc * 100).toFixed(1)}%` : "—";
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) =>
      row.original.is_active ? (
        <span className="text-green-600 text-sm font-medium">Active</span>
      ) : (
        <span className="text-gray-400 text-sm">Inactive</span>
      ),
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: (info) =>
      new Date(info.getValue() as string).toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) =>
      !row.original.is_active && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => onActivate(row.original.id)}
        >
          <CheckCircle size={16} className="mr-1" />
          Activate
        </Button>
      ),
  },
];
