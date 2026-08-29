import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import api from "@/api";
import { DataTable } from "@/components/table/DataTable";
import { type SentimentCorrection } from "@/types/AIRetrainProps";
import { getCorrectionColumns } from "./AIRetrainColumns";
import Pagination from "@/components/table/Pagination";

interface AIRetrainProps {
  pendingCount: number;
  onStartRetrain: () => void | Promise<void>;
}

export const AIRetrain = ({ pendingCount, onStartRetrain }: AIRetrainProps) => {
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);
  const disabled = pendingCount === 0 || loading;

  const [sentimentCorrectionList, setSentimentCorrectionList] = useState<
    SentimentCorrection[]
  >([]);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`sentimentcorrections/${id}/`);
      setSentimentCorrectionList((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  const columns = useMemo(() => getCorrectionColumns(handleDelete), []);

  useEffect(() => {
    const fetchSentimentCorrections = async () => {
      try {
        const response = await api.get("sentimentcorrections/");
        setSentimentCorrectionList(response.data.results);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSentimentCorrections();
  }, []);

  useEffect(() => {
    const fetchSentimentCorrections = async () => {
      try {
        const { pageIndex, pageSize } = pagination;
        const offset = pageIndex * pageSize;
        const response = await api.get(
          `sentimentcorrections/?limit=${pageSize}&offset=${offset}`,
        );
        setSentimentCorrectionList(response.data.results);
        setRowCount(response.data.count);
      } catch (error) {
        console.log(error);
      }
    };
    fetchSentimentCorrections();
  }, [pagination]);

  const table = useReactTable({
    data: sentimentCorrectionList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount,
    onPaginationChange: setPagination,
    state: { pagination },
  });

  const handleClick = async () => {
    setLoading(true);

    try {
      await onStartRetrain();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scale-90 origin-top mt-10">
      <div className="flex items-center justify-between px-5 py-4 bg-white border border-gray-200 rounded-xl">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Model retraining
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {pendingCount} pending correction
            {pendingCount === 1 ? "" : "s"} in queue
          </p>
        </div>

        <button
          onClick={handleClick}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 active:scale-[0.98] transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          {loading ? "Starting..." : "Start retraining"}
        </button>
      </div>
      <div className="flex flex-col mt-5">
        <DataTable table={table} />
      </div>
      {/* Pagination */}
      <div className="mt-2">
        <Pagination table={table} />
      </div>
    </div>
  );
};
