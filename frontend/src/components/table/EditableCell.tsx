import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { CellContext } from "@tanstack/react-table";
import { Sentiment, SentimentPostType } from "../../types/TableColumnProps";

const EditableCell = ({
  getValue,
  row,
  column,
  table,
}: CellContext<SentimentPostType, unknown>) => {
  const initialValue = getValue() as string;
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta!.updateData!(row.index, column.id, value);
  };
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return (
    <Input
      type="text"
      value={value}
      onBlur={onBlur}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setValue(e.target.value)
      }
      className="w-full"
    />
  );
};

export default EditableCell;
