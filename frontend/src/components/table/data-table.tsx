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
import { useEffect, useState } from "react";
import api from "../../api";
import { Posttype } from "./columns";
import { Button } from "../ui/button";

export function DataTable({ columns }) {
  const [data, setData] = useState<Posttype[]>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
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
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
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
    <div className="flex flex-col h-full items-center justify-center">
      <div className="overflow-hidden rounded-md border">
        <Table
          className="items-center justify-center"
          style={{ width: table.getCenterTotalSize() }}
        >
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
      <div className="flex items-center justify-center mt-10">
        <Button
          variant="default"
          className="mr-5"
          size=""
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </Button>
        <Button
          variant="default"
          className="mr-5"
          size=""
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </Button>
        <Button
          variant="default"
          className="mr-5"
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
      <span className="flex justify-center text-center items-center gap-1">
        <div className="justify-center text-center items-center my-5">Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount().toLocaleString()}
        </strong>
      </span>
    </div>
  );
}
