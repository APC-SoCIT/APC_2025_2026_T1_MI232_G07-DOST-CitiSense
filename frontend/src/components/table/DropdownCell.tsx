import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  TableDropdownMenuLabel,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { senArray } from "./columns";

const DropdownCell = ({ getValue, row, column, table }) => {
  const sentiment = getValue();
  const { updateData } = table.options.meta;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-20 focus-visible:ring" variant="ghost" size="">
          {sentiment}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <TableDropdownMenuLabel className="text-left text-sm text-muted-foreground">
          Sentiment
        </TableDropdownMenuLabel>
        <DropdownMenuSeparator className="" />
        {senArray.map(({ label, color }) => (
          <DropdownMenuItem
            key={label}
            className="pr-5"
            inset={false}
            onClick={() => updateData(row.index, column.id, label)}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 mr-1 rounded-full ${color}`} />
              <span>{label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownCell;
