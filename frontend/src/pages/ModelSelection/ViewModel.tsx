import api from "@/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type SpecificModelProps } from "@/types/ModelSelectionProps";
import axios from "axios";
import { CheckCircle, ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ViewModel = () => {
  const [specificModel, setSpecificModel] = useState<SpecificModelProps>();
  const navigate = useNavigate();
  let params = useParams();
  const modelID = params.id;

  const getSpecificModel = async () => {
    try {
      // Get the specific model from the url parameter which is from the ID
      const response = await api.get(`models/${modelID}`);
      setSpecificModel(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
      }
    }
  };

  useEffect(() => {
    getSpecificModel();
  }, [modelID]);

  if (!specificModel) {
    return (
      <div>
        <Loader2 className="w-20 h-20 animate-spin [animation-duration:2s]" />{" "}
      </div>
    );
  }

  // Handle the activation of a specific model
  const handleActivate = async () => {
    try {
      await api.post(`models/${modelID}/activate/`);
      getSpecificModel();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pt-1">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ChevronLeft /> Go back
      </Button>
      <div className="scale-95 origin-top mt-7">
        <div className="mt-2 text-3xl font-bold flex flex-row">
          Model name: {specificModel.version_name}
          <span className="ml-3 items-center flex">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                specificModel.is_active ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-muted-foreground pl-1">
              {specificModel.is_active ? "Active" : "Inactive"}
            </span>
          </span>
          {!specificModel.is_active && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-4 ml-auto"
              onClick={() => handleActivate()}
            >
              <CheckCircle size={16} className="mr-1" />
              Activate
            </Button>
          )}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          Trained on {specificModel.samples_used ?? "N/A"} samples · created{" "}
          {new Date(specificModel.created_at).toLocaleString("en-PH", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </div>

        <div className="mt-8 grid grid-cols-4 gap-3">
          <Card className="flex flex-col gap-1 rounded-xl border p-4">
            <div className="text-sm text-muted-foreground">Accuracy</div>
            <div className="text-3xl font-semibold tabular-nums">
              {specificModel.eval_results?.eval_accuracy.toFixed(1) ?? "N/A"}
            </div>
          </Card>

          <Card className="flex flex-col gap-1 rounded-xl border p-4">
            <div className="text-sm text-muted-foreground">Loss</div>
            <div className="text-3xl font-semibold tabular-nums">
              {specificModel.eval_results?.eval_loss.toFixed(3) ?? "N/A"}
            </div>
          </Card>

          <Card className="flex flex-col gap-1 rounded-xl border p-4">
            <div className="text-sm text-muted-foreground">Runtime</div>
            <div className="text-3xl font-semibold tabular-nums">
              {specificModel.eval_results?.eval_runtime.toFixed(2) ?? "N/A"}s
            </div>
          </Card>

          <Card className="flex flex-col gap-1 rounded-xl border p-4">
            <div className="text-sm text-muted-foreground">Epoch</div>
            <div className="text-3xl font-semibold tabular-nums">
              {specificModel.eval_results?.epoch ?? "N/A"}
            </div>
          </Card>
        </div>
        <div className="mt-10">
          <h1 className="text-2xl font-semibold">Classification Report</h1>
          {specificModel.eval_results ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Precision</TableHead>
                    <TableHead>Recall</TableHead>
                    <TableHead>F1-score</TableHead>
                    <TableHead>Support</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Negative</TableCell>
                    <TableCell>
                      {specificModel.eval_results.eval_classification_report[
                        "0"
                      ]?.precision ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      {specificModel.eval_results.eval_classification_report[
                        "0"
                      ]?.recall ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      {specificModel.eval_results.eval_classification_report[
                        "0"
                      ]?.["f1-score"] ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      {specificModel.eval_results.eval_classification_report[
                        "0"
                      ]?.support ?? "N/A"}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Positive</TableCell>
                    <TableCell>
                      {specificModel.eval_results.eval_classification_report[
                        "1"
                      ]?.precision ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      {specificModel.eval_results.eval_classification_report[
                        "1"
                      ]?.recall ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      {specificModel.eval_results.eval_classification_report[
                        "1"
                      ]?.["f1-score"] ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      {specificModel.eval_results.eval_classification_report[
                        "1"
                      ]?.support ?? "N/A"}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-medium">Neutral</TableCell>
                    <TableCell>
                      {specificModel.eval_results.eval_classification_report[
                        "2"
                      ]?.precision ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      {specificModel.eval_results.eval_classification_report[
                        "2"
                      ]?.recall ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      {specificModel.eval_results.eval_classification_report[
                        "2"
                      ]?.["f1-score"] ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      {specificModel.eval_results.eval_classification_report[
                        "2"
                      ]?.support ?? "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </>
          ) : (
            <Card className="p-6 mt-3">
              <p className="text-muted-foreground">
                No evaluation results available.
              </p>
            </Card>
          )}
        </div>
        <div className="mt-10">
          <h1 className="text-2xl font-semibold">Confusion Matrix</h1>
          {specificModel.eval_results ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Actual / Predicted</TableHead>
                  <TableHead>Negative</TableHead>
                  <TableHead>Positive</TableHead>
                  <TableHead>Neutral</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {["Negative", "Positive", "Neutral"].map((label, i) => (
                  <TableRow key={label}>
                    <TableCell className="font-medium">{label}</TableCell>
                    {specificModel.eval_results?.eval_confusion_matrix[i]?.map(
                      (val, j) => (
                        <TableCell
                          key={j}
                          className={i === j ? "font-semibold" : ""}
                        >
                          {val}
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Card className="p-6 mt-3">
              <p className="text-muted-foreground">
                No evaluation results available.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewModel;
