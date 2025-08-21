import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  TableDropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { senArray } from "./TableColumns";

const DropdownCell = ({ getValue, row, column, table }) => {
  const sentiment = getValue();
  const { updateData } = table.options.meta;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className="w-30 focus-visible:ring" variant="outline">
          {sentiment}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        {/* <TableDropdownMenuLabel className="text-left text-sm text-muted-foreground">
          Sentiment
        </TableDropdownMenuLabel> */}
        {/* <DropdownMenuSeparator className="" /> */}
        {senArray.map(({ label, color }) => (
          <TableDropdownMenuItem
            key={label}
            className=""
            onClick={() => updateData(row.index, column.id, label)}
          >
            <div className="flex items-center">
              <span className={`w-2 h-2 mr-5 ml-2 rounded-full ${color}`} />
              <span>{label}</span>
            </div>
          </TableDropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownCell;
