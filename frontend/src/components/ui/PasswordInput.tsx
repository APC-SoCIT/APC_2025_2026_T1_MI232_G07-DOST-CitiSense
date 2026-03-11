import React from "react";
import { Input } from "./input";
import { Button } from "./button";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./tooltip";
import { Checkbox } from "./checkbox";
type PasswordInputProps = React.ComponentProps<"input"> & {
  showToolTip?: boolean;
};
const PasswordInput = ({
  value,
  showToolTip = true,
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  const password = value ? String(value) : "";
  const passwordHas8Characters = password?.length >= 8;
  const passwordHasANumber = /[0-9]/.test(password);
  const passwordHasAnUpperCase = /[A-Z]/.test(password);

  const inputField = (
    <div className="relative h-12 flex items-center">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className="h-9 px-3 text-base pr-10"
        placeholder=""
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-0 h-6 w-6 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeIcon className="w-4 h-4" />
        ) : (
          <EyeOffIcon className="w-4 h-4" />
        )}
      </Button>
    </div>
  );

  if (!showToolTip) {
    // Just render the input field if the showpasswordtooltip props is false
    return inputField;
  }
  return (
    <TooltipProvider>
      <Tooltip open={showPasswordTooltip}>
        <TooltipTrigger asChild>
          <div
            onFocus={() => setShowPasswordTooltip(true)}
            onMouseLeave={() => setShowPasswordTooltip(false)}
            onMouseEnter={() => setShowPasswordTooltip(true)}
            onBlur={() => setShowPasswordTooltip(false)}
          >
            {inputField}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={8}
          className="bg-white text-black border shadow-lg rounded-md p-3 w-64"
        >
          {" "}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Checkbox checked={passwordHas8Characters} />
              <span>At least 8 characters</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Checkbox checked={passwordHasANumber} />
              <span>Must include a number</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Checkbox checked={passwordHasAnUpperCase} />
              <span>Must include a capital letter</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PasswordInput;
