import { type DateRange } from "react-day-picker";

export type sentimentFeedbackDataProps = {
  service_name: string[];
  service_type: string[];
};

export type FilterDropdownMenuItemProps = {
  title: string;
  serviceArray: string[];
  handleFilter: (service: string) => void;
  filterServiceArray: string[];
  placeholder: string;
  handleSelectAll: (selectAll: boolean) => void;
};

export type FilterCalendarProps = {
  title: string;
  placeholder: string;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
};

export type DashboardDropdownProps = {
  session: string[];
  handleSelectChange: (quarter: string) => void;
  filterValue: string[];
};

export type DashboardDialogProps = {
  image: string;
  isOpen: boolean;
  setIsOpen: () => void;
  fileName: string;
  setFileName: (fileName: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  dialogTitle: string;
  descriptionText: string;
  buttonText: string;
};

export type DashboardFilterProps = {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  serviceNameArray: string[];
  serviceTypeArray: string[];
  filterServiceNameArray: string[];
  filterServiceTypeArray: string[];
  setFilterServiceNameArray: (serviceName: string[]) => void;
  setFilterServiceTypeArray: (serviceType: string[]) => void;
};

export type DashboardSettingsProps = {
  getGenderTooltip: (limit: number) => void;
  isGenderTooltipLoading: boolean;
  getServiceTooltip: (limit: number) => void;
  isServiceTooltipLoading: boolean;
  setShowCustomTooltip: React.Dispatch<React.SetStateAction<boolean>>;
};
