"use client";

import { ColumnFiltersState, flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import React, { useEffect, useMemo } from "react";
import { useSidebar } from "../ui/sidebar";
import { toast } from "sonner";
import CustomTableBody, { MemoizedTableBody } from "./TableBody";
import { TableProps } from "./TableColumns";

export function DataTable({ table }: TableProps) {
  const { state } = useSidebar(); //for conditional rendering based on sidebar closed or open state

  //scroll to top whenever page index resets, based on pagination
  useEffect(() => {
    window.scroll(0, 0);
  }, [table.getState().pagination]);

  useEffect(() => {
    if (!table.getIsSomeColumnsVisible()) {
      toast.error("No Columns Shown");
    }
  }, [table.getIsSomeColumnsVisible()]);

  // calculate all column sizes at once, and save it during rerenders
  // passes the column sizes as CSS variables to the Table component
  // recalculates again if column sizing changes
  // reference: https://tanstack.com/table/latest/docs/framework/react/examples/column-resizing-performant
  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  }, [table.getState().columnSizing, table.getState().columnSizingInfo]);

  return (
    <div>
      <div className="rounded-md border overflow-x-auto w-full">
        <div
          className="divTable"
          style={{
            ...columnSizeVars,
          }}
        >
          <Table className="table-fixed">
            <TableHeader className="bg-gray-100">
              {!table.getIsSomeColumnsVisible() ? (
                <Table>
                  <TableHeader>
                    <TableHead className="text-center">
                      No columns are visible.
                    </TableHead>
                  </TableHeader>
                </Table>
              ) : (
                table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className="border-r-2 relative text-center truncate"
                          colSpan={header.colSpan}
                          style={{
                            width: `calc(var(--header-${header?.id}-size) * 1px)`,
                          }}
                        >
                          {/* column header rendering */}
                          {!header.isPlaceholder && (
                            <div className="flex items-center justify-center">
                              <div
                                className={`flex-1 items-center justify-center text-center ${
                                  header.column.getCanFilter() ? "" : ""
                                }`}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </div>
                              {/* filter button
                            {header.column.getCanFilter() && (
                              <FilterDropdown
                                column={header.column}
                                columnFilters={columnFilters}
                              />
                            )} */}
                            </div>
                          )}

                          {/* column resizing */}
                          <div
                            onDoubleClick={() => header.column.resetSize()}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={`absolute right-0 top-0 h-full w-1.5 cursor-col-resize select-none z-10 ${
                              header.column.getIsResizing() ? "bg-gray-500" : ""
                            }`}
                          />
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableHeader>
            {/* memoized cell body; for performant column resizing 
                only rerenders once data is added, updated, or deleted */}
            {table.getState().columnSizingInfo.isResizingColumn ? (
              <MemoizedTableBody table={table} />
            ) : (
              <CustomTableBody table={table} />
            )}
          </Table>
        </div>
      </div>
    </div>
  );
}
