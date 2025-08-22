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

type DialogProps = {
  showDialog?: boolean;
  setShowDialog?: (open: boolean) => void;
  text: string | string[];
};

// Dialog popup for when there is an error in updating row/s in the table.
const Dialog1 = ({ showDialog, setShowDialog, text }: DialogProps) => {
  // checks if the passed value is an array, then maps through it to display error messages
  // else just render the text
  const renderMessage = () => {
    if (Array.isArray(text)) {
      return text.map((error, i) => <p key={i}>{error}</p>);
    }
    return text;
  };

  //to display for the dialog title
  const dialogTitle = Array.isArray(text)
    ? "Error updating"
    : "Full text display";

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      {/* if text is a string, then render a trigger; this is for the table full text display */}
      {typeof text === "string" ? (
        <DialogTrigger className="cursor-pointer">{text}</DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">{dialogTitle}</DialogTitle>
        </DialogHeader>

        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-gray-800">
          {renderMessage()}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="" variant="default">
              Okay, got it
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Dialog1;
