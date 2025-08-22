import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { FileDown, Pencil } from "lucide-react";

export type archiveProps = {
  id: number;
  title: string;
  date_created: string;
  image: string;
};

//column definition array initialization, this is where tanstack table is referencing from
export const getArchiveColumns = (
  setOriginalItem: React.Dispatch<React.SetStateAction<archiveProps | null>>,
  handleImageDownload: (item: archiveProps) => void
): ColumnDef<archiveProps>[] => [
  {
    accessorKey: "title",
    header: () => <span>Title</span>,
    cell: (info) => info.getValue(),
    size: 379,
  },
  {
    accessorKey: "date_created",
    header: () => <span>Date created</span>,
    cell: (info) => info.getValue(),
    size: 457,
  },
  {
    id: "actions",
    header: () => <span>Actions</span>,
    cell: (props) => {
      const item = props.row.original;
      return (
        <div className="">
          <Button
            className="border w-8 h-8 bg-gray-50 mr-2"
            variant="outline"
            onClick={() => {
              setOriginalItem(item); //pass the current item object to the activeItem for the state to be updated or deleted
            }}
          >
            <Pencil />
          </Button>
          <Button
            className="border bg-green-500 w-8 h-8 bg-gray-50"
            variant="outline"
            onClick={() => handleImageDownload(item)} //pass the item object to the activeItem for the dialog to render
          >
            <FileDown />
          </Button>
        </div>
      );
    },
    enableResizing: false,
  },
];
