import React from "react";
import { TableBody, TableCell, TableRow } from "../ui/table";
import { flexRender } from "@tanstack/react-table";

type CustomTableBodyProps = {
  table: any;
};

const CustomTableBody = ({ table }: CustomTableBodyProps) => {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className="h-[55px]"
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className="font-normal text-center truncate max-w-0"
                style={{
                  width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={table.getAllColumns().length}
            className="h-24 text-center"
          >
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export default CustomTableBody;
//memoizes the cells in the table body; doesn't rerender if pagination, filtering, visibility, and resizing happens.
//only rerenders once data is added, updated, or deleted.
export const MemoizedTableBody = React.memo(
  CustomTableBody,
  (prev, next) => prev.table.options.data === next.table.options.data
) as typeof CustomTableBody;
