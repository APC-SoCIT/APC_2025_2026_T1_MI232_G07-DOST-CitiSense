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
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { ChevronDown, Download, Loader2, Settings } from "lucide-react";
import { DashboardSettingsProps } from "../../../types/DashboardProps";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

const DashboardSettings = ({
  getGenderTooltip,
  isGenderTooltipLoading,
  getServiceTooltip,
  isServiceTooltipLoading,
}: DashboardSettingsProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<number>(10);

  const handleGenerateSummaries = async () => {
    setOpen(false);
    // Call the genderTooltip function first, then the serviceTooltip. This is to prevent any issues with parallel text going into the AI model
    await getGenderTooltip(selectedRows);
    await getServiceTooltip(selectedRows);
  };
  const rowArray = [10, 50, 100, 200, 500, 1000];
  return (
    <div className="flex flex-col min-w-0">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-gray-100">
            <Settings />{" "}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dashboard Tools</DialogTitle>
            <DialogDescription>
              Export reports or generate AI summaries for tooltip insights.
            </DialogDescription>
          </DialogHeader>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                size="lg"
                className="w-full justify-between"
                variant="outline"
              >
                <span
                  className={`truncate ${
                    selectedRows === null ? "text-muted-foreground" : ""
                  }`}
                >
                  {selectedRows === null
                    ? "Please select something"
                    : selectedRows}
                </span>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="className={`min-w-[var(--radix-dropdown-menu-trigger-width)] max-h-48 max-w-3xs">
              {rowArray.map((item, index) => (
                <DropdownMenuItem
                  className=""
                  onSelect={() => setSelectedRows(item)}
                  inset={false}
                  key={index}
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="bluedefault"
            className="w-full sm:w-auto"
            onClick={() => handleGenerateSummaries()}
            disabled={isGenderTooltipLoading}
          >
            {isGenderTooltipLoading || isServiceTooltipLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Summaries"
            )}{" "}
          </Button>
          {/* Buttons */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-green-500 text-white"
              onClick={() => alert("Export clicked")}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" className="w-full sm:w-auto">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardSettings;
