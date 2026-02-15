import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { ThematicAnalysisTableProps } from "../../types/ChartsProps";

export const fallbackThemes = [
  { top: "DATA-001", percentage: 22 },
  { top: "DATA-002", percentage: 18 },
  { top: "DATA-003", percentage: 15 },
  { top: "DATA-004", percentage: 14 },
  { top: "DATA-005", percentage: 16 },
  { top: "DATA-006", percentage: 15 },
];

const ThematicAnalysisTable = ({ themes }: ThematicAnalysisTableProps) => {
  const isFallback = themes === fallbackThemes;
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-5">
        <h1 className="font-sans font-medium text-xl">Thematic Analysis </h1>{" "}
        <span className="ml-2 text-sm text-muted-foreground">
          {" "}
          (This is the list of the most talked about topic/theme)
        </span>
      </div>

      <Table>
        <TableCaption>
          {" "}
          {isFallback && (
            <p className="text-red-500 text-xs mb-2">
              Showing fake/fallback data. Please generate themes from the
              dashboard settings.
            </p>
          )}
        </TableCaption>
        <TableHeader>
          <TableRow className="border-b border-gray-300">
            <TableHead className="text-center text-xl border-r border-gray-300">
              Topic
            </TableHead>
            <TableHead className="text-center text-xl">Percent</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {themes.map((theme) => (
            <TableRow key={theme.top}>
              <TableCell className="text-center font-medium text-l border-r border-gray-300">
                {theme.top}
              </TableCell>
              <TableCell className="text-center text-l">
                {theme.percentage} %
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ThematicAnalysisTable;
