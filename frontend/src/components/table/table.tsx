import React, { useEffect } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { mockData } from "./tabledata";
import api from "../../api";

type Gender = "M" | "F";
type Sentiment = "Positive" | "Negative" | "Neutral";

export type Posttype = {
  id: number;
  name: string;
  service: string;
  gender: Gender;
  feedback: string;
  sentiment: Sentiment;
};

const columnHelper = createColumnHelper<Posttype>();

const columns = [
  columnHelper.accessor("id", {
    cell: (info) => info.getValue(),
    header: () => <span>ID</span>,
  }),
  columnHelper.accessor("name", {
    cell: (info) => info.getValue(),
    header: () => <span>name</span>,
  }),
  columnHelper.accessor("service", {
    cell: (info) => info.getValue(),
    header: () => <span>service</span>,
  }),
  columnHelper.accessor("gender", {
    cell: (info) => info.getValue(),
    header: () => <span>gender</span>,
  }),
  columnHelper.accessor("feedback", {
    cell: (info) => info.getValue(),
    header: () => <span>feedback</span>,
  }),
  columnHelper.accessor("sentiment", {
    cell: (info) => info.getValue(),
    header: () => <span>sentiment</span>,
  }),
];

export default function Table() {
  const [data, setData] = React.useState(() => [...mockData]);

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
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
  });
  console.log('this is the core row model', table.getCoreRowModel())
  console.log('this is the column', table.getHeaderGroups())
  return (
    <div className="flex items-center justify-center min-h-full">
      <table
        style={{ width: table.getCenterTotalSize() }}
        className="border border-gray-300 items-center justify-center "
      >
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="border px-4 relative"
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    <div
                      onDoubleClick={() => header.column.resetSize()}
                      onMouseDown={header.getResizeHandler()}
                      className={`absolute right-0 top-0 h-full w-1.5 cursor-col-resize select-none z-10 ${
                        header.column.getIsResizing() ? "bg-blue-500" : ""
                      }`}
                    />
                  </th>
                ))}
              </tr>
            );
          })}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border px-4 text-center"
                  style={{ width: cell.column.getSize() }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
