import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
type ConfirmDialogProps = {
  confirmDelete: boolean;
  setConfirmDelete: (confirmDelete: boolean) => void;
  onConfirm: () => void;
  descriptionText: string;
  title: string;
  actionText: string;
};
const ConfirmDialog = ({
  confirmDelete,
  setConfirmDelete,
  onConfirm,
  descriptionText,
  title,
  actionText,
}: ConfirmDialogProps) => {
  return (
    <div>
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription className="font-medium">
              {descriptionText}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-800"
              onClick={onConfirm}
            >
              {actionText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConfirmDialog;
