import React, { useEffect, useMemo, useState } from "react";
import { DataTable } from "./DataTable";
import { getColumns } from "./TableColumns";
import { Posttype } from "./TableColumns";
import api from "../../api";

const DataTablePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<Posttype[]>([]);
  const [originalData, setOriginalData] = useState<Posttype[]>([]);
  const [editedRows, setEditedRows] = useState<Set<number>>(new Set());
  const columns = useMemo(() => getColumns(isEditing), [isEditing]);

  const handleEditOrCancel = () => {
    if (isEditing) {
      setData(originalData);
      setEditedRows(new Set());
      setIsEditing(!isEditing);
    } else {
      setIsEditing(true);
    }
  };

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

      await Promise.all(
        toBeUpdated.map((row) => {
          return api.put(`/sentimentposts/${row.id}/`, row);
        })
      );
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
    <div className="scale-80">
      <DataTable
        columns={columns}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editedRows={editedRows}
        setEditedRows={setEditedRows}
        data={data}
        setData={setData}
        postChange={postChange}
        handleEditOrCancel={handleEditOrCancel}
      />
    </div>
  );
};

export default DataTablePage;
