import React from "react";
import { Input } from "../ui/input";

const FilterText = ({ column }) => {
  const columnFilterValue = column.getFilterValue();
  return (
    <Input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      className=""
    />
  );
};

export default FilterText;
