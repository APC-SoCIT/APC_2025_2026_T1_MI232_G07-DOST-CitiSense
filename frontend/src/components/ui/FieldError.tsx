import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type FieldErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  message?: string;
};

const FieldError = ({ message, className }: FieldErrorProps) => {
  if (!message) return null;
  return (
    <div>
      <p
        className={cn(
          "text-red-500 text-sm flex items-center gap-1 -mt-1",
          className,
        )}
      >
        <CircleAlert className="w-4 h-4" /> {message}
      </p>
    </div>
  );
};

export default FieldError;
