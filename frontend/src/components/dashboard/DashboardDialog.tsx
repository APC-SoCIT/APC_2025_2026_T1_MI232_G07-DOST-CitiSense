import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const DashboardDialog = ({
  image,
  isOpen,
  setIsOpen,
  fileName,
  setFileName,
  onCancel,
  onConfirm,
  dialogTitle,
  descriptionText,
  buttonText,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-5xl">
        <DialogTitle className="text-2xl">{dialogTitle}</DialogTitle>
        <div>
          <img src={image} alt="Dashboard Preview" />{" "}
          <h1 className="text-black text-md mb-2">{descriptionText}</h1>
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
          <Button className="" variant="destructive" onClick={onCancel}>
            {buttonText}
          </Button>
          <Button className="" variant="greendefault" onClick={onConfirm}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardDialog;
