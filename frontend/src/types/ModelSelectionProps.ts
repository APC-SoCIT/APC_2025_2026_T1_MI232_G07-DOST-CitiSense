export type ModelVersion = {
  id: number;
  version_name: string;
  model_path: string;
  is_active: boolean;
  samples_used: number;
  eval_results: {
    eval_accuracy?: number;
    [key: string]: unknown;
  } | null;
  created_at: string;
};

export type SpecificModelProps = {
  version_name: string;
  model_path: string;
  is_active: boolean;
  trained_on_corrections: string[];
  samples_used: number;
  eval_results: EvalResults;
  created_at: string;
};

export type EvalClassificationReportMetrics = {
  recall: number;
  support: number;
  "f1-score": number;
  precision: number;
};

export type EvalClassificationReport = {
  "0"?: EvalClassificationReportMetrics;
  "1"?: EvalClassificationReportMetrics;
  "2"?: EvalClassificationReportMetrics;
  accuracy: number;
  "macro avg": EvalClassificationReportMetrics;
  "weighted avg": EvalClassificationReportMetrics;
};

export type EvalResults = {
  epoch: number;
  eval_loss: number;
  eval_runtime: number;
  eval_accuracy: number;
  eval_confusion_matrix: number[][];
  eval_steps_per_second: number;
  eval_samples_per_second: number;
  eval_classification_report: EvalClassificationReport;
};
