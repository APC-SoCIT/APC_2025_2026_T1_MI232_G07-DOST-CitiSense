import React, { useState, useEffect, useMemo } from "react";
import api from "../api";
import ArchiveDialog from "./ArchiveDialog";
import { DataTable } from "../components/table/DataTable";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { archiveProps } from "./ArchiveColumns";
import { getArchiveColumns } from "./ArchiveColumns";
import Pagination from "../components/table/Pagination";
import { toast } from "sonner";
import ConfirmDialog from "./ConfirmDialog";

const Archive = () => {
  const [data, setData] = useState<archiveProps[]>([]);
  const [originalItem, setOriginalItem] = useState<archiveProps | null>(null);
  const [downloadName, setDownloadName] = useState<string | undefined>("");

  //sets the downloadName as the original file name from the backend; trigger changes whenever user types something new in the input element
  useEffect(() => {
    setDownloadName(originalItem?.title);
  }, [originalItem]);

  //gets and initializes the state of pagination from localstorage, defaults to index: 0, and size: 10 when no pagination is saved.
  const [pagination, setPagination] = useState(() => {
    const savedPagination = localStorage.getItem("pagination");
    return savedPagination
      ? JSON.parse(savedPagination)
      : {
          pageIndex: 0,
          pageSize: 10,
        };
  });

  //puts the current pagination set by user in localstorage
  useEffect(() => {
    localStorage.setItem("pagination", JSON.stringify(pagination));
  }, [pagination]);

  const handleImageDownload = async (item: archiveProps) => {
    //reference: https://medium.com/@sameervaghela21/how-to-show-download-progress-of-file-using-javascript-fetch-in-reactjs-how-to-force-download-4e9723762b64
    try {
      const image = item.image;
      const response = await fetch(image);
      const blob = await response.blob();
      const blobURL = URL.createObjectURL(blob); //converts the blob which is a binary to a local url string

      //gets the image url in memory, and download the image through the invisible href link
      const link = document.createElement("a");
      link.href = blobURL;
      document.body.appendChild(link); //appends the invisible anchor tag to the dom
      link.download = item.title;
      link.click();
      document.body.removeChild(link); //removes the invisible anchor after download
      URL.revokeObjectURL(blobURL); // url object is revoked after saving
      toast.success("Successfully downloaded image!");
    } catch (error) {
      toast.error("Failed to save image.");
    }
  };

  //to memoize the columns, and only render on when setoriginalitem changes which is technically the archiveDialog; if it's being rendered or not
  //this is to also pass the setOriginalItem, and handleImageDownload function to the column definition
  const columns = useMemo(
    () => getArchiveColumns(setOriginalItem, handleImageDownload),
    [setOriginalItem]
  );

  const handleArchiveDelete = async (originalItem: archiveProps) => {
    try {
      await api.delete(`/archive/${originalItem.id}/`);
      setOriginalItem(null);
    } catch (error) {
      console.log(error.message);
      console.log(error.response?.data);
      toast.error("Failed to delete this instance");
    }
  };

  const handleArchiveEdit = async (
    originalItem: archiveProps,
    downloadName: string
  ) => {
    try {
      const image = await fetch(originalItem?.image); //get the url of the image
      const blob = await image.blob(); //convert the url to binary

      //check if the filename ends with an extension ".png" or ".jpg"
      const fileNameEnd =
        downloadName.endsWith(".png") || downloadName.endsWith(".jpg");

      let finalFileName = downloadName;

      //if file name doesn't include a file extension, then append ".png" to it
      if (!fileNameEnd) {
        finalFileName += ".png";
      }

      //create a form data and append the image and the fileName to the formData
      const newForm = new FormData();
      newForm.append("title", finalFileName);
      newForm.append("image", blob, finalFileName);

      //update the data referencing it's primary key
      await api.put(`/archive/${originalItem.id}/`, newForm);
      toast.success("Updated data!");
      setOriginalItem(null);
    } catch (error) {
      console.log(error.message);
      console.log(error.response?.data);
      toast.error("Failed to update data.");
    }
  };

  //gets the data from archive endpoint from the backend
  useEffect(() => {
    const getImage = async () => {
      try {
        const res = await api.get("/archive/");
        console.log(res);
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getImage();
  }, [originalItem]);

  //initialization of the table that tanstack uses, along with its settings
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    enableColumnResizing: false,
    autoResetPageIndex: false,
    state: {
      pagination,
    },
  });

  return (
    <div className="min-w-7xl max-w-[90%] mx-auto mt-10">
      <div className=" items-center justify-center rounded-2xl">
        {/* table */}
        <DataTable table={table} />
        {/* dialog for viewing, updating, and deleting the archived images */}
        <ArchiveDialog
          image={originalItem?.image}
          originalItem={originalItem}
          setOriginalItem={setOriginalItem}
          handleArchiveEdit={handleArchiveEdit}
          handleArchiveDelete={handleArchiveDelete}
          downloadName={downloadName}
          setDownloadName={setDownloadName}
        />

        {/* pagination */}
        <div className="mt-2 mb-10">
          <Pagination table={table} />
        </div>
      </div>
    </div>
  );
};

export default Archive;
