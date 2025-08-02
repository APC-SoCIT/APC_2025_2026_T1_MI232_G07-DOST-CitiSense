"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import React, { useEffect, useState } from "react";
import api from "../../api";
import { Posttype } from "./columns";
import { Button } from "../ui/button";

import { ChevronDown } from "lucide-react";
import ColumnVisibility from "./ColumnVisibility";

export function DataTable({ columns }) {
  const [data, setData] = useState<Posttype[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 7,
  });
  const [columnVisibility, setColumnVisibility] = useState({});

  useEffect(() => {
    const getSentimentData = async () => {
      try {
        const res = await api.get("/sentimentposts/");
        setData(res?.data);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    getSentimentData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      pagination,
      columnVisibility,
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex ? { ...row, [columnId]: value } : row
          )
        );
      },
    },
  });

  console.log(table.options.state);

  return (
    <div className="-mt-16">
      <div className="flex flex-col w-full mx-auto">
        <div className="flex justify-end py-2">
          <ColumnVisibility table={table} />
        </div>
        <div className="overflow-x-auto rounded-md border">
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
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
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
        <div className="flex items-center justify-center mt-4">
          <Button
            variant="default"
            className="mr-4"
            size=""
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            variant="default"
            className="mr-4"
            size=""
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            variant="default"
            className="mr-4"
            size=""
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            variant="default"
            className=""
            size=""
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </div>
        <span className="flex justify-center text-center items-center gap-1 mt-2">
          <div className="justify-center text-center items-center">Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
      </div>
    </div>
  );
}
