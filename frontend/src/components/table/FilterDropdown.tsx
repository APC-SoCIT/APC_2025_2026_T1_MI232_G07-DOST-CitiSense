import React, { useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Funnel } from "lucide-react";

const FilterDropdown = ({ column }) => {
  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).slice(0, 5000),
    [column.getFacetedUniqueValues()]
  );

  return (
    <DropdownMenu>
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
        <DropdownMenuRadioGroup
          value={columnFilterValue?.toString()}
          onValueChange={(e) => column.setFilterValue(e)}
        >
          <DropdownMenuRadioItem className="text-red-500" value="">
            Clear
          </DropdownMenuRadioItem>
          {sortedUniqueValues.map((value) => (
            <DropdownMenuRadioItem
              value={String(value)}
              key={String(value)}
              className="flex items-center"
            >
              {value}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdown;
