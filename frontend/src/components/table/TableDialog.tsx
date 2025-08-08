import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

// Dialog popup for when there is an error in updating row/s in the table.
const Dialog1 = ({ showDialog, setShowDialog, errorMessages }) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Error</DialogTitle>
          <DialogDescription className="text-center">
            Failed to update the following rows
          </DialogDescription>
        </DialogHeader>

        <DialogDescription className="text-xs">
          <div>
            {errorMessages.map((error, i) => (
              <p key={i}>{error}</p>
            ))}
          </div>
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="" size="" variant="default">
              Okay, got it
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Dialog1;
