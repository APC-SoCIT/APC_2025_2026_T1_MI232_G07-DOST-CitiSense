import type { AIRetrainDialogFormProps } from "@/pages/AIRetrain/AIRetrainDialog";

export type SentimentCorrection = {
  id: number;
  comments: string;
  original_sentiment: string;
  corrected_sentiment: string;
  status: string;
  created_at: string;
};

export type AIRetrainDialogProps = {
  loading: boolean;
  disabled?: boolean;
  onRetrain: (formData: AIRetrainDialogFormProps) => void;
  rowCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formError?: string;
};
