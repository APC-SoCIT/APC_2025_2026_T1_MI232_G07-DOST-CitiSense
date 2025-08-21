import React, { useEffect, useState } from "react";
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
import api from "../api";
import { toast } from "sonner";

const DashboardDialog = ({ image, isSaving, setIsSaving }) => {
  //state for the name of the image to be downloaded; default to dashboard
  let [fileName, setFileName] = useState("dashboard.jpg");

  const handleArchiveSubmit = async () => {
    //get the url of the image
    const response = await fetch(image);
    //convert the url to binary
    const blob = await response.blob();

    //check if the filename ends with an extension ".png" or ".jpg"
    const fileNameEnd = fileName.endsWith(".png") || fileName.endsWith(".jpg");

    let finalFileName = fileName;
    //if file name doesn't include a file extension, then append ".png" to it
    if (!fileNameEnd) {
      finalFileName += ".png";
    }

    //create a form data and append the image and the fileName to the formData
    const formData = new FormData();
    formData.append("image", blob, finalFileName);
    formData.append("title", finalFileName);

    try {
      //post the formData to the backend
      await api.post("/archive/", formData);
      setIsSaving(false);
      toast.success("Successfully archived image!");
    } catch (error) {
      console.log("this is the error", error.response?.data);
      alert("error");
    }
  };

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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFileName(e.target.value)
            }
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="" variant="destructive">
              Redo?
            </Button>
          </DialogClose>
          <Button
            className=""
            variant="greendefault"
            onClick={() => handleArchiveSubmit()}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardDialog;
