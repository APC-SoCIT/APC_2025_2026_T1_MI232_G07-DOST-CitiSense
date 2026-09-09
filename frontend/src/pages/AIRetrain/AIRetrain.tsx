import { useEffect, useMemo, useState } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import api from "@/api";
import { DataTable } from "@/components/table/DataTable";
import { type SentimentCorrection } from "@/types/AIRetrainProps";
import { getCorrectionColumns } from "./AIRetrainColumns";
import Pagination from "@/components/table/Pagination";
import {
  AIRetrainDialog,
  type AIRetrainDialogFormProps,
} from "./AIRetrainDialog";
import { toast } from "sonner";
import axios from "axios";
import { type ModelVersion } from "@/types/ModelSelectionProps";

export const AIRetrain = () => {
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [rowCount, setRowCount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sentimentCorrectionList, setSentimentCorrectionList] = useState<
    SentimentCorrection[]
  >([]);
  const [formError, setFormError] = useState<string>();
  const [modelList, setModelList] = useState<ModelVersion[]>([]);

  // Delete the certain rows and afterwards update the table in real-time
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`sentimentcorrections/${id}/`);
      setSentimentCorrectionList((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch the columns for the AI Retrain table, and pass the handleDelete function to it.
  const columns = useMemo(() => getCorrectionColumns(handleDelete), []);

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

  const handleClick = async (formData: AIRetrainDialogFormProps) => {
    setLoading(true);
    setFormError(undefined);
    try {
      const response = await api.post("sentimentcorrections/retrain/", {
        model_name: formData.model_name,
        model_id: formData.model_id,
      });
      console.log(response.data);
      toast.success(`Model "${formData.model_name}" trained and activated`);
      setDialogOpen(false);

      console.log(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setFormError(error.response?.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await api.get("/models");
      setModelList(response.data.results);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div className="scale-90 origin-top mt-10">
      <div className="flex items-center justify-between px-5 py-4 bg-white border border-gray-200 rounded-xl">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Model retraining
          </h2>
        </div>
        <AIRetrainDialog
          loading={loading}
          disabled={rowCount === 0}
          onRetrain={handleClick}
          rowCount={rowCount}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          formError={formError}
          modelList={modelList}
        />
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
