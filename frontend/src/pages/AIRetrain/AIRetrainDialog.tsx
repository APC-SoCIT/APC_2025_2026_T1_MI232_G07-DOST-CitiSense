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

const AIRetrainDialogSchema = z.object({
  model_name: z.string().min(1, "Please input at least 1 character."),
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
}: AIRetrainDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AIRetrainDialogFormProps>({
    resolver: zodResolver(AIRetrainDialogSchema),
  });

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
          <Field>
            <Label>Model Name</Label>
            <Input {...register("model_name")} placeholder="v1" />
            <FieldError message={formError ?? errors.model_name?.message} />
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
