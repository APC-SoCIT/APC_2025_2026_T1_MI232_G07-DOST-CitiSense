import type { Table } from "@tanstack/react-table";
import type { SentimentPostType } from "./TableColumnProps";
import type { RowData, Column } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData?: (rowIndex: number, columnId: string, value: string) => void;
  }
}

export type FilterTextProps = {
  column: Column<SentimentPostType, unknown>;
};

export type TableToolbarProps = {
  table: Table<SentimentPostType>;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  postChange: () => void;
  handleEditOrCancel: () => void;
  filterParams: string;
  rowCount: number;
};

export type TableDialogProps = {
  showDialog?: boolean;
  setShowDialog?: (open: boolean) => void;
  text: string | string[];
};
