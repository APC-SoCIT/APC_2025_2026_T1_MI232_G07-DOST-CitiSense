import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  ChevronDown,
  EyeOff,
  MoveHorizontal,
  SaveIcon,
  Settings,
  SquareCheckBig,
  Trash2,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { writeFileXLSX, utils, write } from "xlsx";
import { Table } from "@tanstack/react-table";
import { SentimentPostType } from "./TableColumns";

type TableToolbarProps = {
  table: Table<SentimentPostType>;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  postChange: () => void;
  handleEditOrCancel: () => void;
};

const TableSettings = ({
  table,
  isEditing,
  setIsEditing,
  postChange,
  handleEditOrCancel,
}: TableToolbarProps) => {
  const handleTableExport = async (rows: any[]) => {
    // extract the row data from the tanstack table
    const tableData = rows.map((row) => row.original);

    // create a new workbook
    const workbook = utils.book_new();

    // create a new worksheet and populate it with the tanstack table contents
    const worksheet = utils.json_to_sheet(tableData);

    //append the worksheet to the workbook
    utils.book_append_sheet(workbook, worksheet, "Sheet 1");

    //check if the browser has the
    if (window.showSaveFilePicker) {
      const hFile = await window.showSaveFilePicker({
        suggestedName: "Worksheet.xlsx",
        types: [
          {
            description: "Excel file",
            accept: {
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                [".xlsx"],
            },
          },
        ],
      });

      const wstream = await hFile.createWritable();
      wstream.write(write(workbook, { bookType: "xlsx", type: "array" }));
      wstream.close();
    } else {
      // fallback: just automatically download the xlsx file named as "Workbook"
      writeFileXLSX(workbook, "Workbook.xlsx");
    }
  };

  return (
    <div className="flex flex-row justify-between">
      <div className="justify-start py-2">
        {/* Filter column by visibility */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <span className="hidden md:inline">Filter Columns</span>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="">
            {table.getAllColumns().map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className={`${
                    column.id.length === 2 ? "uppercase" : "capitalize"
                  }`}
                  onSelect={(e: Event) => e.preventDefault()}
                  checked={column.getIsVisible()}
                  onCheckedChange={(isChecked: boolean) => {
                    column.toggleVisibility(isChecked);
                  }}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>{" "}
      </div>

      {/* Edit and save for table updating */}
      <div className="flex justify-between py-2 ">
        <Button
          className="mx-2"
          variant={isEditing ? "destructive" : "bluedefault"}
          onClick={handleEditOrCancel}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
        <Button
          className="mr-2"
          variant="default"
          onClick={() => {
            postChange?.();
          }}
          disabled={!isEditing}
        >
          Save
        </Button>
        <Button
          disabled={table.getPreFilteredRowModel().rows.length < 0}
          className="mr-2"
          variant="greendefault"
          onClick={() => handleTableExport(table.getPreFilteredRowModel().rows)}
        >
          Export
        </Button>
        {/* Table settings for unified reset of table state */}
        <Popover>
          <PopoverTrigger asChild>
            <Button className="" variant="outline">
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60" align="end">
            <div className="flex flex-row justify-between">
              <h4 className="text-sm font-medium mb-3">Table Settings</h4>
              <div>
                <Button
                  size="sm"
                  className="h-6 w-6 mr-2"
                  variant="destructive"
                  onClick={() => {
                    table.resetColumnFilters();
                    localStorage.removeItem("filterValue");
                    table.resetColumnVisibility();
                    localStorage.removeItem("columnVisibility");
                    table.resetColumnSizing();
                    localStorage.removeItem("columnSizing");
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Button
                className="justify-start"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  table.resetColumnFilters();
                  localStorage.removeItem("filterValue");
                }}
              >
                <SquareCheckBig className="mr-1" />
                Reset Column Filters
              </Button>

              <Button
                className="justify-start"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  table.resetColumnVisibility();
                  localStorage.removeItem("columnVisibility");
                }}
              >
                <EyeOff className="mr-1" />
                Reset Column Visibility
              </Button>

              <Button
                className="justify-start"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  table.resetColumnSizing();
                  localStorage.removeItem("columnSizing");
                }}
              >
                <MoveHorizontal className="mr-1" />
                Reset Column Sizing
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TableSettings;
