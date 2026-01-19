import * as React from "react";
import { cn } from "../../lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded border border-input bg-background checked:bg-primary checked:border-primary focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-all",
          className
        )}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
