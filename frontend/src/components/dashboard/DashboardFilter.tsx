import React, { useEffect, useState } from "react";
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
import { Filter } from "lucide-react";
import FilterDropdownMenuItem from "./FilterDropdownMenuItem";
import FilterCalendar from "./FilterCalendar";
import { type DateRange } from "react-day-picker";
import { serviceNames } from "../../mockdata/fakeServiceFilter";
import { DashboardFilterProps } from "../../types/DashboardProps";

const DashboardFilter = ({
  dateRange,
  setDateRange,
  serviceNameArray,
  serviceTypeArray,
  filterServiceNameArray,
  filterServiceTypeArray,
  setFilterServiceNameArray,
  setFilterServiceTypeArray,
}: DashboardFilterProps) => {
  // Local states so updating the filters in the dialog box doesn't update the dashboard just yet. Only after when you click apply.
  const [localDateRange, setLocalDateRange] = useState<DateRange | undefined>();
  const [localServiceName, setLocalServiceName] = useState<string[]>([]);
  const [localServiceType, setLocalServiceType] = useState<string[]>([]);

  // On mount, populate the localService state with the current serviceArray values; serviceArray contains the unique services
  useEffect(() => {
    setLocalServiceName(filterServiceNameArray);
    setLocalServiceType(filterServiceTypeArray);
  }, [filterServiceNameArray, filterServiceTypeArray]);

  const handleServiceNameFilter = (serviceName: string) => {
    // Get the current localServiceType array state and assign each item in it to the prev variable
    setLocalServiceName((prev) =>
      // If the current array includes the serviceType, then filter it out.
      // Else, put it in the localServiceType array.
      prev.includes(serviceName)
        ? prev.filter((item) => item !== serviceName)
        : [...prev, serviceName],
    );
  };

  const handleServiceTypeFilter = (serviceType: string) => {
    // Get the current localServiceType array state and assign each item in it to the prev variable
    setLocalServiceType((prev) =>
      // If the current array includes the serviceType, then filter it out.
      // Else, put it in the localServiceType array.
      prev.includes(serviceType)
        ? prev.filter((item) => item !== serviceType)
        : [...prev, serviceType],
    );
  };

  // This is to give the local state of the filter dialog back to the dashboard
  const applyServiceFilters = () => {
    setDateRange(localDateRange);
    setFilterServiceNameArray(localServiceName);
    setFilterServiceTypeArray(localServiceType);
  };

  // Function to select/deselect all service names
  const handleSelectAllServiceName = (selectAll = true) => {
    setLocalServiceName(selectAll ? serviceNameArray : []);
  };

  // Function to select/deselect all service types
  const handleSelectAllServiceType = (selectAll = true) => {
    setLocalServiceType(selectAll ? serviceTypeArray : []);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gray-100" variant="outline">
          <Filter /> <span className="hidden md:inline">Filter</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-xl sm:w-full lg:min-w-xl">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
          <DialogDescription>Apply filters to the dashboard</DialogDescription>
        </DialogHeader>

        <FilterDropdownMenuItem
          title="Service"
          serviceArray={serviceNameArray}
          handleFilter={handleServiceNameFilter}
          filterServiceArray={localServiceName}
          placeholder="ex. Online Library Seminar: Cloud Technologies"
          handleSelectAll={handleSelectAllServiceName}
        />

        <FilterDropdownMenuItem
          title="Service Type"
          serviceArray={serviceTypeArray}
          handleFilter={handleServiceTypeFilter}
          filterServiceArray={localServiceType}
          placeholder="ex. Material Requests"
          handleSelectAll={handleSelectAllServiceType}
        />
        <FilterCalendar
          title="Date"
          placeholder="ex. January 10 - March 10, 2025"
          setDateRange={setLocalDateRange}
          dateRange={localDateRange}
        />
        <DialogFooter className="flex flex-row justify-between ">
          <div className="flex-1">
            <Button
              variant="ghost"
              className="text-blue-600 hover:text-blue-800"
              onClick={() => {
                setLocalDateRange(undefined);
                setLocalServiceName([]);
                setLocalServiceType([]);
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
              <Button type="submit" onClick={() => applyServiceFilters()}>
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
