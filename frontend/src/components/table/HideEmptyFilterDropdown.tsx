import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Funnel } from "lucide-react";

interface HideEmptyFilterDropdownProps {
  column: any;
}

const HideEmptyFilterDropdown = ({ column }: HideEmptyFilterDropdownProps) => {
  const getFilterValue = column.getFilterValue() === "hideEmpty";
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className="p-1 rounded hover:bg-sky-100 scale-70"
          variant="outline"
        >
          <Funnel />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          checked={getFilterValue}
          onCheckedChange={(checked) =>
            // Pass the hideEmpty value to the search params for the intended columns
            column.setFilterValue(checked ? "hideEmpty" : undefined)
          }
          onSelect={(e: Event) => e.preventDefault()}
        >
          Hide empty
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HideEmptyFilterDropdown;
