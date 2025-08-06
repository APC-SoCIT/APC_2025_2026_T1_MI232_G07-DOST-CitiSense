import React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";

const ColumnVisibility = ({ table }) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className="" variant="outline" size="">
          Filter Columns
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        {table.getAllColumns().map((column) => {
          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              className={`${
                column.id.length === 2 ? "uppercase" : "capitalize"
              }`}
              onSelect={(e: Event) => e.preventDefault()}
              checked={column.getIsVisible()}
              onCheckedChange={(isChecked: boolean) =>
                column.toggleVisibility(isChecked)
              }
            >
              {column.id}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnVisibility;
