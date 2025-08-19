import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const DashboardDialog = ({ image, isSaving, setIsSaving }) => {
  //state for the name of the image to be downloaded; default to dashboard
  const [fileName, setFileName] = useState("dashboard.png");
  return (
    <Dialog open={isSaving} onOpenChange={setIsSaving}>
      <DialogContent className="min-w-5xl">
        <DialogTitle className="text-2xl">Preview image</DialogTitle>
        <div>
          <img src={image} alt="Dashboard Preview" />{" "}
          <h1 className="text-black text-md mb-2">
            Please enter a name for the file to be downloaded
          </h1>
          <Input
            type="text"
            className=""
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button size="" className="" variant="destructive">
              Redo?
            </Button>
          </DialogClose>
          <Button
            size=""
            className=""
            variant="greendefault"
            onClick={() => {
              //gets the image url in memory, and download the image through the invisible href link
              const link = document.createElement("a");
              link.href = image;
              link.download = fileName;
              link.click();
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardDialog;
