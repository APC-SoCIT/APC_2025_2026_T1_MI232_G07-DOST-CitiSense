import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
  TableDropdownMenuCheckBoxItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { Input } from "../ui/input";
import { useMemo, useState } from "react";
import type { FilterDropdownMenuItemProps } from "../../types/DashboardProps";

const FilterDropdownMenuItem = ({
  title,
  serviceArray,
  handleFilter,
  filterServiceArray,
  placeholder,
  handleSelectAll,
}: FilterDropdownMenuItemProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Reference for the search term code: https://stackoverflow.com/a/68740356
  const filterSearchTerm = useMemo(() => {
    return serviceArray.filter((service) =>
      service.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [serviceArray, searchTerm]);

  return (
    <div className="flex flex-col min-w-0">
      <span className="p-1">{title}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="w-full justify-between"
            variant="outline"
          >
            <span className="text-muted-foreground truncate">
              {/* If nothing is selected, then show message */}
              {filterServiceArray.length === 0
                ? "Nothing selected"
                : // If both the serviceArray and the filteredServiceArray contain the same no. of items then show the placeholder,
                  // else just show the selected services
                  filterServiceArray.length === serviceArray.length
                  ? placeholder
                  : filterServiceArray.join(", ")}
            </span>

            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          // Render a horizontal scroll if an item inside the dropdown has more than 75 characters length
          className={`min-w-[var(--radix-dropdown-menu-trigger-width)] max-h-48 max-w-3xs ${
            serviceArray.some((item) => item.length > 75)
              ? "overflow-x-scroll"
              : ""
          }
          )}`}
        >
          <Input
            className="mb-2"
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.stopPropagation()
            }
            onClick={(e: React.MouseEvent<HTMLInputElement>) =>
              e.stopPropagation()
            }
            type="text"
            placeholder="Please input a service name"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target?.value)
            }
          />
          {/* Don't render the select/deselect all checkbox when typing in the search bar */}
          {searchTerm === "" && (
            <TableDropdownMenuCheckBoxItem
              className=""
              checked={filterServiceArray.length === serviceArray.length}
              onCheckedChange={(checked: boolean) => {
                if (checked) {
                  handleSelectAll(checked);
                } else {
                  handleSelectAll(false);
                }
              }}
              onSelect={(e: Event) => e.preventDefault()}
            >
              Select all
            </TableDropdownMenuCheckBoxItem>
          )}
          {filterSearchTerm.length === 0 ? (
            <div className="text-gray-400 text-center text-lg">No results</div>
          ) : (
            filterSearchTerm.map((service, index) => (
              <TableDropdownMenuCheckBoxItem
                checked={filterServiceArray.includes(service)}
                onCheckedChange={() => handleFilter(service)}
                onSelect={(e: Event) => e.preventDefault()}
                className=""
                key={index}
              >
                {service}
              </TableDropdownMenuCheckBoxItem>
            ))
          )}{" "}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FilterDropdownMenuItem;
