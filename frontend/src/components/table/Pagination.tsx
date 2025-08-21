import { Button } from "../ui/button";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Pagination = ({ table }) => {
  return (
    <div className="flex w-full items-center justify-between">
      {/* page count */}
      <span className="flex justify-center text-center items-center gap-1 text-muted-foreground">
        <span>Page</span>
        <span>
          {table.getPageCount() === 0
            ? 1
            : table.getState().pagination.pageIndex + 1}{" "}
          of {(table.getPageCount() || 1).toLocaleString()}
        </span>
      </span>
      {/* no. of rows to be shown */}
      <div className="flex">
        <div className="mr-2">
          <span className="mr-2">Rows per page</span>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button className="" variant="outline">
                {table.getState().pagination.pageSize}
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className=""
              onCloseAutoFocus={(e: Event) => e.preventDefault()}
            >
              <DropdownMenuRadioGroup
                value={String(table.getState().pagination.pageSize)}
                onValueChange={(e: number) => {
                  table.setPageSize(e);
                  localStorage.setItem("pageSize", String(e));
                }}
              >
                {[7, 10, 20, 30, 40, 50, 100, 500].map((pageSize) => (
                  <DropdownMenuRadioItem
                    key={pageSize}
                    className="text-mono"
                    value={String(pageSize)}
                    disabled={pageSize > table.getRowCount()}
                  >
                    Show {pageSize}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* pagination buttons: next, previous, first, last */}
        <Button
          variant="outline"
          className="mr-1"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          className="mr-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          className="mr-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          className=""
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
