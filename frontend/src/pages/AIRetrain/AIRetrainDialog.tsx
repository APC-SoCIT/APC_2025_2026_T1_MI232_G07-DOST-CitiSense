import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import { RefreshCw } from "lucide-react";
import { type AIRetrainDialogProps } from "@/types/AIRetrainProps";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import FieldError from "@/components/ui/FieldError";
import AIRetrainDialogDropdown from "./AIRetrainDialogDropdown";
import type { ModelVersion } from "@/types/ModelSelectionProps";

const AIRetrainDialogSchema = z.object({
  model_name: z.string().min(1, "Please input at least 1 character."),
  model_id: z.number({ error: "Please select a checkpoint" }),
});

export type AIRetrainDialogFormProps = z.infer<typeof AIRetrainDialogSchema>;

export function AIRetrainDialog({
  loading,
  disabled = false,
  onRetrain,
  rowCount,
  open,
  onOpenChange,
  formError,
  modelList,
}: AIRetrainDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AIRetrainDialogFormProps>({
    resolver: zodResolver(AIRetrainDialogSchema),
  });

  const selectedModelId = watch("model_id");
  const selectedModel = modelList.find((m) => m.id === selectedModelId);

  const onSelectModel = async (model: ModelVersion) => {
    setValue("model_id", model.id); // store just the clicked model's id into the form state
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled || loading}>
          Retrain
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Retrain an AI model</DialogTitle>
          <DialogDescription>
            Here is where you train an AI model
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onRetrain)}>
          <Field className="pb-5">
            <Label>Model Name</Label>
            <Input {...register("model_name")} placeholder="v1" />
            <FieldError message={formError ?? errors.model_name?.message} />
          </Field>
          <Field>
            <Label>Model Checkpoint</Label>
            <AIRetrainDialogDropdown
              modelList={modelList}
              onSelectModel={onSelectModel}
              selectedModel={selectedModel}
            />
          </Field>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="destructive" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="greendefault"
              disabled={rowCount === 0 || loading}
            >
              <RefreshCw className={loading ? "animate-spin" : ""} />
              {loading ? "Starting..." : "Start retraining"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
