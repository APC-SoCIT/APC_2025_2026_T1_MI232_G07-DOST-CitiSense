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
import { Check, ChevronDown, Download, Loader2, Settings } from "lucide-react";
import type { DashboardSettingsProps } from "../../../types/DashboardProps";
import { toast } from "sonner";
import { ExportFile } from "./ExportFile";
import DashboardSettingsDropdown from "./DashboardSettingsDropdown";

const DashboardSettings = ({
  getGenderTooltip,
  isGenderTooltipLoading,
  getServiceTooltip,
  isServiceTooltipLoading,
  setShowCustomTooltip,
  getThemes,
  totalCount,
  gaugeValue,
  genderValue,
  serviceValue,
  themes,
  genderTooltip,
  genderTooltipCount,
  serviceTooltip,
  serviceTooltipCount,
}: DashboardSettingsProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<number>(0);

  const handleGenerateSummaries = async () => {
    setOpen(false);
    try {
      // Call the genderTooltip function first, then the serviceTooltip. This is to prevent any issues with parallel text going into the AI model
      await getGenderTooltip(selectedRows);
      await getServiceTooltip(selectedRows);
      setShowCustomTooltip(true);
      toast.success("Successfully summarized chart content!");
    } catch (error) {
      console.log("Failed to generate summaries: ", error);
      setShowCustomTooltip(false);
      toast.error("Failed to generate summaries. Please try again.");
    }
  };

  const handleGenerateThematicAnalysis = async () => {
    setOpen(false);
    try {
      await getThemes(selectedRows);
      toast.success("Successfully generated themes");
    } catch (error) {
      console.log("Failed to generate themes: ", error);
      toast.error("Failed to generate themes.");
    }
  };
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
            <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
              Export reports, generate AI summaries or common themes — all based
              on your current filters.
            </DialogDescription>
          </DialogHeader>
          <DashboardSettingsDropdown
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
          <div className="flex flex-col sm:flex-row sm:items-center min-w-full justify-between gap-2">
            <Button
              variant="bluedefault"
              className="flex-1  w-full sm:w-auto"
              onClick={() => handleGenerateThematicAnalysis()}
              disabled={isGenderTooltipLoading}
            >
              {isGenderTooltipLoading || isServiceTooltipLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Themes"
              )}{" "}
            </Button>
            <Button
              variant="bluedefault"
              className="flex-1 w-full sm:w-auto"
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
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            {/* Export file button */}
            <ExportFile
              totalCount={totalCount}
              gauge={gaugeValue}
              genderValue={genderValue}
              serviceValue={serviceValue}
              themes={themes}
              genderTooltip={genderTooltip}
              genderTooltipCount={genderTooltipCount}
              serviceTooltip={serviceTooltip}
              serviceTooltipCount={serviceTooltipCount}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto bg-red-500 text-white hover:bg-red-600"
                >
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
