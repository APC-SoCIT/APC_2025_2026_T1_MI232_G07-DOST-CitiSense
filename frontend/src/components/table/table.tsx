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
  });

  return (
    <div className="flex items-center justify-center min-h-full">
      <table className="border border-gray-300 items-center justify-center ">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="border px-4"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            );
          })}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td key={cell.id} className="border px-4">
                    {" "}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
