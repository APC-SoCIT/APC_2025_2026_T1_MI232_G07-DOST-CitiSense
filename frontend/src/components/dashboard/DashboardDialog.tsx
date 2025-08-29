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
        <div className="max-h-[80vh] overflow-x-auto overflow-y-auto">
          <img
            src={image}
            alt="Dashboard Preview"
            className="max-w-full h-auto"
          />{" "}
          <h1 className="text-black text-md mb-2">{descriptionText}</h1>
          <Input
            type="text"
            className=""
            value={fileName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFileName(e.target.value)
            }
          />
          <DialogFooter className="mt-2">
            <Button className="" variant="destructive" onClick={onCancel}>
              {buttonText}
            </Button>
            <Button className="" variant="greendefault" onClick={onConfirm}>
              Save
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardDialog;
