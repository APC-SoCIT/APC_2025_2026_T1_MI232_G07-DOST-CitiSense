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
  Settings,
  SquareCheckBig,
  Table,
  Trash2,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface TableToolbarProps {
  table: any;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  postChange: () => void;
  handleEditOrCancel: () => void;
}

const TableSettings = ({
  table,
  isEditing,
  setIsEditing,
  postChange,
  handleEditOrCancel,
}: TableToolbarProps) => {
  return (
    <div className="flex flex-row justify-between">
      <div className=" justify-start py-2">
        {/* Filter column by visibility */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button className="" variant="outline" size="">
              Filter Columns
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
          className="mr-2"
          size=""
          variant={isEditing ? "destructive" : "bluedefault"}
          onClick={handleEditOrCancel}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
        <Button
          className="mr-2"
          size=""
          variant="default"
          onClick={() => {
            postChange?.();
          }}
          disabled={!isEditing}
        >
          Save
        </Button>

        {/* Table settings for unified reset of table state */}
        <Popover>
          <PopoverTrigger asChild>
            <Button size="" className="" variant="outline">
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-60" align="end">
            <div className="flex flex-row justify-between">
              <h4 className="text-sm font-medium mb-3">Table Settings</h4>
              <Button
                size="sm"
                className="h-5 w-5"
                variant="destructive"
                onClick={(e: Event) => {
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
            <div className="grid gap-2">
              <Button
                className="justify-start"
                size=""
                variant="outline"
                onClick={(e: Event) => {
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
                size=""
                variant="outline"
                onClick={(e: Event) => {
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
                size=""
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
