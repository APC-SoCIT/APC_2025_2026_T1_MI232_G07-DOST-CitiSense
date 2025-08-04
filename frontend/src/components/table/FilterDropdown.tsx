import React, { useMemo } from "react";
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
import { getFacetedUniqueValues } from "@tanstack/react-table";

const FilterDropdown = ({ column }) => {
  const columnFilterValue = column.getFilterValue() ?? []; //fallback array if user hasn't filtered anything yet

  // transform unique values into an key, value pairs
  // only get the first 5,000 and only recalculate if not if unique values changed
  const sortedUniqueValues = useMemo(
    () =>
      Array.from(column.getFacetedUniqueValues().entries()).slice(
        0,
        5000
      ) as Array<[string | number, number]>, // each sorted unique value returns an array of tuple
    [column.getFacetedUniqueValues()]
  );

  // checks the current value in the column
  // if it isn't in the filter, put the current value in the filter array, else remove it.
  const handleSelectChange = (value: string | number) => {
    if (!columnFilterValue.includes(value)) {
      column.setFilterValue([...columnFilterValue, value]);
    } else {
      column.setFilterValue(
        columnFilterValue.filter((filterWords: string) => filterWords !== value)
      );
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className="p-1 rounded hover:bg-sky-100 scale-70"
          variant="outline"
          size=""
        >
          <Funnel />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuCheckboxItem
          checked={""}
          onCheckedChange={() => column.setFilterValue(undefined)}
          className="text-red-500"
        >
          Clear
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator className="" />
        {sortedUniqueValues.map(([value, count]) => (
          <TableDropdownMenuCheckBoxItem
            key={String(value)}
            className=""
            checked={columnFilterValue.includes(value)}
            onCheckedChange={() => handleSelectChange(value)}
            onSelect={(e) => e.preventDefault()}
          >
            <div className="flex items-center w-full justify-between">
              <span className="text-sm text-gray-800">{value}</span>
              <span className="ml-2 text-xs text-muted-foreground bg-gray-200 px-2 py-0.5 rounded-full">
                {count}{" "}
              </span>
            </div>
          </TableDropdownMenuCheckBoxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
