import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";
import { Button } from "../../ui/button";

type DashboardSettingsDropdownProps = {
  selectedRows: number;
  setSelectedRows: (value: number) => void;
};
const DashboardSettingsDropdown = ({
  selectedRows,
  setSelectedRows,
}: DashboardSettingsDropdownProps) => {
  const rowArray = [1, 5, 10, 50, 100, 200, 500, 1000];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg" className="w-full justify-between" variant="outline">
          <span
            className={`truncate ${
              selectedRows === null ? "text-muted-foreground" : ""
            }`}
          >
            {selectedRows === null ? "Please select something" : selectedRows}
          </span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-48 overflow-auto">
        {rowArray.map((item, index) => (
          <DropdownMenuItem
            className="w-full flex justify-between items-center"
            onSelect={() => setSelectedRows(item)}
            inset={false}
            key={index}
          >
            <span>{item}</span>
            {selectedRows === item && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DashboardSettingsDropdown;
