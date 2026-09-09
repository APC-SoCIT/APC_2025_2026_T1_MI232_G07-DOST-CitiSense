import { useEffect, useMemo, useState } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import api from "@/api";
import { DataTable } from "@/components/table/DataTable";
import { getModelColumns } from "./ModelSelectionColumn";
import Pagination from "@/components/table/Pagination";
import { type ModelVersion } from "@/types/ModelSelectionProps";
import { AIRetrainDialog } from "../AIRetrain/AIRetrainDialog";

const ModelSelection = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);
  const [modelList, setModelList] = useState<ModelVersion[]>([]);

  const fetchModels = async () => {
    try {
      const { pageIndex, pageSize } = pagination;
      const offset = pageIndex * pageSize;
      const response = await api.get(
        `models/?limit=${pageSize}&offset=${offset}`,
      );
      const res = await api.get("models/?is_active=true");
      console.log(res.data.results[0].version_name);
      setModelList(response.data.results);
      setRowCount(response.data.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [pagination]);

  // Handle the activation of a specific model
  const handleActivate = async (id: number) => {
    try {
      await api.post(`models/${id}/activate/`);
      fetchModels();
    } catch (error) {
      console.log(error);
    }
  };

  const columns = useMemo(() => getModelColumns(handleActivate), []);

  const table = useReactTable({
    data: modelList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount,
    onPaginationChange: setPagination,
    state: { pagination },
  });

  return (
    <div className="scale-90 origin-top mt-10">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Model versions</h2>
      <DataTable table={table} />
      <div className="mt-2">
        <Pagination table={table} />
      </div>
    </div>
  );
};

export default ModelSelection;
