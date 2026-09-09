import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AIRetrainDialogDropdownProps } from "@/types/AIRetrainProps";
import { ChevronDown } from "lucide-react";

const AIRetrainDialogDropdown = ({
  modelList,
  onSelectModel,
  selectedModel,
}: AIRetrainDialogDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex justify-between w-full">
          <span
            className={`${selectedModel ? "" : "text-muted-foreground text-sm"}`}
          >
            {selectedModel?.version_name ?? "Please select a model"}
          </span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
        {modelList.map((model) => (
          <DropdownMenuItem
            className="w-full"
            key={model.id}
            onClick={() => onSelectModel(model)}
          >
            {model.version_name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AIRetrainDialogDropdown;
