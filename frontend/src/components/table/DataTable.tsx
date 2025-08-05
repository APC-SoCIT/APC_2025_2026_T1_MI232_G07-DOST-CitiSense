"use client";

import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import React, { useState } from "react";
import { Button } from "../ui/button";

import ColumnVisibility from "./ColumnVisibility";
import FilterDropdown from "./FilterDropdown";
import Pagination from "./Pagination";

export function DataTable({
  columns,
  isEditing,
  setIsEditing,
  editedRows,
  setEditedRows,
  data,
  setData,
  postChange,
  handleEditOrCancel,
}) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 7,
  });
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    autoResetPageIndex: false,
    state: {
      pagination,
      columnVisibility,
      columnFilters,
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex ? { ...row, [columnId]: value } : row
          )
        );
        const toBeUpdated = data[rowIndex].id;
        setEditedRows((prev) => new Set(prev).add(toBeUpdated)); //convert to set for unique value storage
      },
    },
  });

  return (
    <div className="-mt-2">
      <div className="flex flex-col w-full mx-auto">
        <div className="flex flex-row justify-between">
          <div className=" justify-start py-2">
            <ColumnVisibility table={table} />
          </div>
          <div className="flex justify-between py-2 ">
            <Button
              className="mr-2"
              size=""
              variant={isEditing ? "destructive" : "default"}
              onClick={handleEditOrCancel}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
            <Button
              className=""
              size=""
              variant="default"
              onClick={() => postChange()}
              disabled={!isEditing}
            >
              Save
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto w-full rounded-md border">
          <Table>
            <TableHeader className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="border-r relative text-center"
                        style={{ width: header.getSize() }}
                      >
                        {/* column header rendering */}
                        {!header.isPlaceholder && (
                          <div className="flex items-center justify-between">
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
                              <div className="justify-end">
                                <FilterDropdown column={header.column} />
                              </div>
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
                        className="border text-center py-3"
                        style={{ width: cell.column.getSize() }}
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
        <div className="flex items-center justify-center mt-4">
          <Pagination table={table} />
        </div>
        <span className="flex justify-center text-center items-center gap-1 mt-2">
          <div className="justify-center text-center items-center">Page</div>
          <strong>
            {table.getPageCount() === 0
              ? 1
              : table.getState().pagination.pageIndex + 1}{" "}
            of {(table.getPageCount() || 1).toLocaleString()}
          </strong>
        </span>
      </div>
      <pre>
        {JSON.stringify(
          { columnFilters: table.getState().columnFilters },
          null,
          2
        )}
      </pre>
    </div>
  );
}
