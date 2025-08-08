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
import React, { useState, useRef, useEffect } from "react";
import FilterDropdown from "./FilterDropdown";
import Pagination from "./Pagination";
import { useSidebar } from "../ui/sidebar";
import { GripVertical } from "lucide-react";

export function DataTable({ table, columns, columnFilters }) {
  const { state } = useSidebar(); //for conditional rendering based on sidebar closed or open state
  const topOfTable = useRef<HTMLDivElement>(null); //reference point

  //scroll to top whenever page index resets, based on pagination
  useEffect(() => {
    window.scroll(0, 0);
  }, [table.getState().pagination]);

  return (
    <div className={state === "collapsed" ? "min-w-7xl" : "min-w-5xl"}>
      <div ref={topOfTable} className="rounded-md border">
        <Table className="table-fixed">
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="border-r-2 relative text-center"
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                    >
                      {/* column header rendering */}
                      {!header.isPlaceholder && (
                        <div className="flex items-center justify-center">
                          <div
                            className={`flex-1 items-center justify-center text-center ${
                              header.column.getCanFilter() ? "ml-10" : ""
                            }`}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>

                          {/* filter button */}
                          {header.column.getCanFilter() && (
                            <FilterDropdown
                              column={header.column}
                              columnFilters={columnFilters}
                            />
                          )}
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
            ))}
          </TableHeader>
          {/* row cell */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="font-normal text-center truncate max-w-0"
                      style={{
                        width: cell.column.getSize(),
                        minWidth: cell.column.columnDef.minSize,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* pagination */}
      <div className="mt-2">
        <Pagination table={table} />
      </div>
    </div>
  );
}
