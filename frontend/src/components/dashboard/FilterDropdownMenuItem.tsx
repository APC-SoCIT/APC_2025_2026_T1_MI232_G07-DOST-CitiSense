import {
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
  TableDropdownMenuItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";

type FilterDropdownMenuItemProps = {
  title: string;
  serviceArray: string[];
  serviceItem: string;
  setServiceItem: (item: string) => void;
};
const FilterDropdownMenuItem = ({
  title,
  serviceArray,
  serviceItem,
  setServiceItem,
}: FilterDropdownMenuItemProps) => {
  return (
    <div className="flex flex-col">
      <span className="p-1">{title}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="w-full justify-between "
            variant="outline"
          >
            <span className="text-muted-foreground">
              {serviceItem || "ex. Online Library Seminar: Cloud Technologies"}
            </span>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[460px]">
          {serviceArray.map((item, index) => (
            <TableDropdownMenuItem
              className=""
              key={index}
              onClick={() => setServiceItem(item)}
            >
              {item}
            </TableDropdownMenuItem>
          ))}{" "}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FilterDropdownMenuItem;
