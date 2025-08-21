import React, { act, useEffect, useState } from "react";
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
import ConfirmDialog from "./ConfirmDialog";

const ArchiveDialog = ({
  image,
  originalItem,
  setOriginalItem,
  handleArchiveEdit,
  handleArchiveDelete,
  downloadName,
  setDownloadName,
}) => {
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  return (
    <div>
      <Dialog open={originalItem} onOpenChange={setOriginalItem}>
        <DialogContent className="min-w-5xl">
          <DialogTitle className="text-2xl">Edit Image</DialogTitle>
          <div>
            <img src={image} alt="Dashboard Preview" />{" "}
            <h1 className="text-black text-md mb-2">
              Update the image name below:
            </h1>
            <Input
              type="text"
              className=""
              value={downloadName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDownloadName(e.target.value)
              }
            />
          </div>

          <DialogFooter>
            <Button
              className=""
              variant="destructive"
              onClick={() => setConfirmDelete(true)}
            >
              Delete?
            </Button>
            <Button
              className=""
              variant="greendefault"
              onClick={() => handleArchiveEdit(originalItem, downloadName)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your image from the server."
        actionText="Delete"
        onConfirm={() => handleArchiveDelete(originalItem)}
      />
    </div>
  );
};

export default ArchiveDialog;
