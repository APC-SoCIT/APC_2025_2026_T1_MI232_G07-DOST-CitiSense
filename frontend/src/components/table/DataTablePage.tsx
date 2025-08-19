import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "./DataTable";
import { getColumns } from "./TableColumns";
import { Posttype } from "./TableColumns";
import api from "../../api";
import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  VisibilityState,
} from "@tanstack/react-table";
import TableSettings from "./TableSettings";
import { toast } from "sonner";
import Dialog1 from "./TableDialog";
import Pagination from "./Pagination";
import { mockData1 } from "../../mockData";

const DataTablePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  // const [data, setData] = useState<Posttype[]>(mockData1);
  const [data, setData] = useState<Posttype[]>([]);
  const [originalData, setOriginalData] = useState<Posttype[]>([]);
  // const [originalData, setOriginalData] = useState<Posttype[]>(mockData1);
  const [editedRows, setEditedRows] = useState<Set<number>>(new Set());
  const columns = useMemo(() => getColumns(isEditing), [isEditing]); //to pass the isEditing to the column definition which is also a function

  //local storage for persistence of user preference in the table component

  //gets and initializes the column sizing from localstorage so user preference persists after reload
  const [columnSizing, setColumnSizing] = useState(() => {
    const savedSizing = localStorage.getItem("columnSizing");
    return savedSizing ? JSON.parse(savedSizing) : {};
  });

  //puts the column sizing changes in local storage whenever user changes column size
  useEffect(() => {
    localStorage.setItem("columnSizing", JSON.stringify(columnSizing));
  }, [columnSizing]);

  //gets and initializes the column visibility from localstorage so user preference persists after reload
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      const savedVisiblity = localStorage.getItem("columnVisibility");
      return savedVisiblity ? JSON.parse(savedVisiblity) : {};
    }
  );

  //puts the column visibility changes in localstorage whenever user toggles column visibility
  localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));

  //gets and initializes the column filters from localstorage so user preference persists after reload
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    const savedFilters = localStorage.getItem("filterValue");
    return savedFilters ? JSON.parse(savedFilters) : [];
  });

  //puts the column filters in localstorage whenever user changes filters
  useEffect(() => {
    localStorage.setItem("filterValue", JSON.stringify(columnFilters));
  }, [columnFilters]);

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

  //initialization of the table that tanstack uses, along with its settings
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnSizingChange: setColumnSizing,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onColumnVisibilityChange: setColumnVisibility,
    autoResetPageIndex: false,
    state: {
      pagination,
      columnVisibility,
      columnSizing,
      columnFilters,
    },

    //for updating a cell within the table, uses meta of tanstack
    //gets the current row index, column name, and the value which is the new value for that cell
    meta: {
      updateData: (
        rowIndex: number,
        columnId: string,
        value: string | number
      ) => {
        //maps through the data array that is fetched from the backend
        //if the current row index to be updated from the table matches the current index of the row in the data array,
        //then create a new row object, by spreading the existing row and updating
        //the specified column with its new value, otherwise keep the row unchanged
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex ? { ...row, [columnId]: value } : row
          )
        );

        //gets the current data array and accesses the current row index of the row to be updated
        //and gets the id property of the current row object
        //puts the row index to be updated in a Set; see PostChange() for continuation
        const toBeUpdated = data[rowIndex].id;
        setEditedRows((prev) => new Set(prev).add(toBeUpdated)); //convert to set for unique value storage
      },
    },
  });

  // after the user clicks cancel edit, the table gets rerendered with the original data
  // this is for when the user clicks cancel after they updated a cell
  const handleEditOrCancel = () => {
    if (isEditing) {
      setData(originalData);
      setEditedRows(new Set());
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  // getting the data for tanstack table to render
  useEffect(() => {
    const getSentimentData = async () => {
      try {
        const res = await api.get("/sentimentposts/");
        setData(res?.data);
        setOriginalData(res?.data);
        // console.log(res);
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };
    getSentimentData();
  }, []);

  const postChange = async () => {
    try {
      //filter rows depending if the value in the editedRows set matches the index id in the data array
      const toBeUpdated = data.filter((index) => editedRows.has(index.id));

      // gets the filtered data, and then put it to the backend to change value of that certain row
      //handled by allSettled, edits and updates the data still even when there is an error.
      const results = await Promise.allSettled(
        toBeUpdated.map((row) => {
          return api.put(`/sentimentposts/${row.id}/`, row);
        })
      );

      //get the values from the promise.allSettled with status "fulfilled"
      const accepted = results.filter(
        (result) => result.status === "fulfilled"
      );

      //get the values from the promise.allSettled with status "rejected"
      const failed = results.filter((result) => result.status === "rejected");

      //notify the user about success or failed updates to the table
      //if failed, show the row index that the row failed to get updated, along with the reason why it failed
      //shown through dialog modals, and toast
      if (failed.length > 0) {
        const reasonMessages = failed.map((msg, index) => {
          return `Row ${index + 1}: ${String(msg?.reason)}`;
        });
        setShowDialog(true);
        setErrorMessages(reasonMessages);
        toast.error(`Error updating ${failed.length} rows`);
      } else {
        toast.success(`Updated ${accepted.length} rows`);
      }

      setEditedRows(new Set());
      setIsEditing(false);

      //safeguard if clicked save with nothing inside editedRows
      if (editedRows.size > 0) {
        setOriginalData(data);
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  //prevents user from exiting the tab when table editing is happening
  useEffect(() => {
    const handleClose = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    if (editedRows.size > 0) {
      window.addEventListener("beforeunload", handleClose);
    }
    return () => {
      window.removeEventListener("beforeunload", handleClose);
    };
  }, [editedRows]);

  return (
    <div className="scale-90 origin-top mt-10">
      <div className="flex flex-col">
        <TableSettings
          table={table}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          postChange={postChange}
          handleEditOrCancel={handleEditOrCancel}
        />
        <DataTable table={table} />
        <Dialog1
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          text={errorMessages}
        />
        {/* pagination */}
        <div className="mt-2">
          <Pagination table={table} />
        </div>
      </div>
    </div>
  );
};

export default DataTablePage;
