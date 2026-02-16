import React from "react";
import { Input } from "../ui/input";
import type { FilterTextProps } from "../../types/TableProps";

const FilterText = ({ column }: FilterTextProps) => {
  const columnFilterValue = column.getFilterValue();
  return (
    <Input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        column.setFilterValue(e.target.value)
      }
      className=""
    />
  );
};

export default FilterText;
