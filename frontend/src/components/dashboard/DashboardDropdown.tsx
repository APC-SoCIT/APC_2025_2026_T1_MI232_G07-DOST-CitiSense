import { useEffect, useState } from "react";
import api from "../../api";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  TableDropdownMenuCheckBoxItem,
} from "../ui/dropdown-menu";

type DashboardDropdownProps = {
  session: string[];
  handleSelectChange: (quarter: string) => void;
  filterValue: string[];
};
const DashboardDropdown = ({
  session,
  handleSelectChange,
  filterValue,
}: DashboardDropdownProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className="bg-gray-100" variant="outline">
          Filter dashboard
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="">
        {session.map((quarter, index) => (
          <DropdownMenuCheckboxItem
            checked={!filterValue.includes(quarter)}
            onCheckedChange={() => handleSelectChange(quarter)}
            onSelect={(e: Event) => e.preventDefault()}
            className="m-1"
            key={index}
          >
            <span className="text-md tracking-wide text-gray-900">
              {quarter}
            </span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DashboardDropdown;
