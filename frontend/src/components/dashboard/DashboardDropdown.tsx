import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Filter } from "lucide-react";
import type { DashboardDropdownProps } from "../../types/DashboardProps";

const DashboardDropdown = ({
  session,
  handleSelectChange,
  filterValue,
}: DashboardDropdownProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className="bg-gray-100" variant="outline">
          <Filter /> <span className="hidden md:inline">Filter</span>
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
