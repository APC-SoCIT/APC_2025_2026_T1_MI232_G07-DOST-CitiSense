import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { Calendar } from "../../components/ui/calendar";
import { FilterCalendarProps } from "../../types/DashboardProps";

const FilterCalendar = ({
  title,
  placeholder,
  dateRange,
  setDateRange,
}: FilterCalendarProps) => {
  return (
    <div className="flex flex-col">
      <span className="p-1">{title}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="w-full justify-between"
            variant="outline"
          >
            <span className="text-muted-foreground">
              {/* Check if there is a date in the dateRange. 
                If there isnt, default to placeholder text*/}
              {dateRange?.from
                ? dateRange?.to
                  ? `${dateRange?.from.toLocaleDateString()} - ${dateRange?.to.toLocaleDateString()}`
                  : `${dateRange.from.toLocaleDateString()}`
                : placeholder}
            </span>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="">
          <div className="">
            <Calendar
              mode="range"
              fixedWeeks
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              className="rounded-lg"
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FilterCalendar;
