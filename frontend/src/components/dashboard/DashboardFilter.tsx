import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ChevronDown, Filter } from "lucide-react";
import FilterDropdownMenuItem from "./FilterDropdownMenuItem";
import FilterCalendar from "./FilterCalendar";
import { type DateRange } from "react-day-picker";

type DashboardFilterProps = {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  serviceItem: string;
  setServiceItem: (item: string) => void;
};

const DashboardFilter = ({
  dateRange,
  setDateRange,
  serviceItem,
  setServiceItem,
}: DashboardFilterProps) => {
  const serviceArray = [
    "Offline Library: Computer Tech",
    "Online Library: Cloud Computing",
    "Workshop: AI & Machine Learning",
    "Seminar: Cybersecurity Essentials",
    "Bootcamp: Web Development Fullstack",
  ];
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>();
  const [localService, setLocalService] = useState<string>("");

  const applyFilters = () => {
    setDateRange(localDateRange);
    setServiceItem(localService);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-100" variant="outline">
          <Filter /> <span className="hidden md:inline">Filter</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription>Apply filters to the dashboard</DialogDescription>
        </DialogHeader>

        <FilterDropdownMenuItem
          title="Service"
          serviceArray={serviceArray}
          serviceItem={localService}
          setServiceItem={setLocalService}
        />

        <FilterCalendar
          title="Date"
          placeholder="ex. January 10 - March 10, 2025"
          setDateRange={setLocalDateRange}
          dateRange={localDateRange}
        />
        <DialogFooter className="flex w-full justify-between">
          <div className="flex-1">
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-800"
              onClick={() => {
                setLocalDateRange(undefined);
                setLocalService("");
              }}
            >
              Clear Filters
            </Button>
          </div>
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" onClick={() => applyFilters()}>
                Apply filters
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardFilter;
