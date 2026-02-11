import React, { useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  TableDropdownMenuCheckBoxItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Funnel } from "lucide-react";
import {
  getFacetedUniqueValues,
  ColumnFiltersState,
} from "@tanstack/react-table";

interface FilterDropdownProps {
  column: any;
  columnFilters?: ColumnFiltersState;
  columnName?: string;
  options: string[];
}
const FilterDropdown = ({
  column,
  columnName,
  options,
}: FilterDropdownProps) => {
  const columnFilterValue = column.getFilterValue() ?? options; //on render start with a full list of the unique values from the rows

  // checks the current value in the column
  // if it isn't in the filter array, put the current value in the filter array; else remove it from the array
  const handleSelectChange = (value: string | number) => {
    let newFilterValue: (string | number)[] = [];
    if (!columnFilterValue.includes(value)) {
      newFilterValue = [...columnFilterValue, value];
    } else {
      newFilterValue = columnFilterValue.filter(
        (filterWords: string) => filterWords !== value,
      );
    }
    column.setFilterValue(newFilterValue);
  };

  // Don't render if no options
  if (!options || options.length === 0) {
    return (
      <Button
        className="p-1 rounded hover:bg-sky-100 scale-70"
        variant="outline"
        disabled
      >
        <Funnel />
      </Button>
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className="p-1 rounded hover:bg-sky-100 scale-70"
          variant="outline"
        >
          {columnName}
          <Funnel />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuCheckboxItem
          checked={false}
          onCheckedChange={() => column.setFilterValue(undefined)}
          className="text-red-500"
        >
          Clear
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator className="" />
        {options.map((value) => (
          <TableDropdownMenuCheckBoxItem
            key={String(value)}
            className=""
            checked={columnFilterValue.includes(value)}
            onCheckedChange={() => handleSelectChange(value)}
            onSelect={(e: Event) => e.preventDefault()}
          >
            <div className="flex items-center w-full justify-between">
              <span className="text-sm text-gray-800">{value}</span>
            </div>
          </TableDropdownMenuCheckBoxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
