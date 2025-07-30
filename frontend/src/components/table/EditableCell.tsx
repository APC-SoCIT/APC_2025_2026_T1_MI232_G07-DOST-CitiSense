import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";

const EditableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value);
  };
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return (
    <Input
      type="text"
      value={value}
      onBlur={onBlur}
      onChange={(e) => setValue(e.target.value)}
      className="w-full"
    />
  );
};

export default EditableCell;
