import Gauge from "../charts/gauge";
import Service from "../charts/service";
import Gender from "../charts/gender";
import { Button } from "../ui/button";
import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import { SentimentPostType } from "../table/TableColumns";
import { Download } from "lucide-react";
import axios from "axios";
import DashboardFilter from "./DashboardFilter";
import { type DateRange } from "react-day-picker";
import { format } from "date-fns";

function GuestDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    try {
      const parsedDate = JSON.parse(
        localStorage.getItem("dateRangeFilter") || "",
      );

      // Convert the parsed JSON (from and to) taken from the localStorage back to Date form
      return {
        from: new Date(parsedDate.from),
        to: new Date(parsedDate.to),
      };
    } catch {
      return undefined;
    }
  });

  // Lazy Initialization from react, just get the value of the serviceNameFilter inside the localStorage on mount
  // This contains the service names checked by the user; used for filtering.
  const [filterServiceNameArray, setFilterServiceNameArray] = useState<
    string[]
  >(() => {
    try {
      return JSON.parse(localStorage.getItem("serviceNameFilter") || "[]");
    } catch {
      return [];
    }
  });

  // Lazy Initialization from react, just get the value of the serviceTypeFilter inside the localStorage on mount
  // This contains the service types checked by the user; used for filtering.
  const [filterServiceTypeArray, setFilterServiceTypeArray] = useState<
    string[]
  >(() => {
    try {
      return JSON.parse(localStorage.getItem("serviceTypeFilter") || "[]");
    } catch {
      return [];
    }
  });
  const [serviceName, setServiceName] = useState<string[]>([]); // This contains the unique service names
  const [serviceType, setServiceType] = useState<string[]>([]); // This contains the unique service types

  useEffect(() => {
    localStorage.setItem("dateRangeFilter", JSON.stringify(dateRange));
    localStorage.setItem(
      "serviceNameFilter",
      JSON.stringify(filterServiceNameArray),
    );

    localStorage.setItem(
      "serviceTypeFilter",
      JSON.stringify(filterServiceTypeArray),
    );

    console.log("Printing filters");
  }, [filterServiceNameArray, filterServiceTypeArray, dateRange]);

  // These are the filter parameters to be included in the URL.
  const filterParams = useMemo(() => {
    // Instantiate an URLSearchParam,this will hold all the filter values to be sent to the backend
    const params = new URLSearchParams();

    // Convert the shownFilters array into URL parameters and convert them to a string.
    filterServiceNameArray.forEach((serviceName) =>
      params.append("service_name", serviceName),
    );
    filterServiceTypeArray.forEach((serviceType) =>
      params.append("service_type", serviceType),
    );
    if (dateRange?.from) {
      // Format the date to only show the year, month, and date; excluding the time
      params.append("from", format(dateRange?.from, "yyyy-MM-dd"));
    }
    if (dateRange?.to) {
      // Format the date to only show the year, month, and date; excluding the time
      params.append("to", format(dateRange?.to, "yyyy-MM-dd"));
    }
    return params.toString();
  }, [filterServiceNameArray, filterServiceTypeArray, dateRange]);
  console.log("This is the dateRange", dateRange);
  console.log("This is the filterservicearray", filterServiceNameArray);

  // On mount fetch the service_name part of the sentiment post
  useEffect(() => {
    setIsLoading(true);
    const fetchServiceFilter = async () => {
      try {
        // Get all the feedback results
        const sentimentFeedbackResults = await api.get("sentimentposts/");
        const sentimentFeedbackData: SentimentPostType[] =
          sentimentFeedbackResults.data.results;

        // Maps through the sentimentFeedbackData array, and just gets the service_name part of the response
        const serviceNames = sentimentFeedbackData.map(
          (item) => item.service_name,
        );

        // Maps through the sentimentFeedbackData array, and just gets the service_type part of the response
        const serviceTypes = sentimentFeedbackData.map(
          (item) => item.service_type,
        );

        // Convert the service name and service type to an array to set; this is so that the array only contain the unique values
        const getUniqueServiceNames = new Set(serviceNames);
        const getUnqiueServiceTypes = new Set(serviceTypes);

        // Convert the set back to an array and sort it alphabetically
        const serviceFilterNameArray = Array.from(getUniqueServiceNames).sort(
          (a, b) => a.localeCompare(b),
        );
        const serviceFilterTypeArray = Array.from(getUnqiueServiceTypes).sort(
          (a, b) => a.localeCompare(b),
        );
        setServiceName(serviceFilterNameArray);
        setServiceType(serviceFilterTypeArray);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.response?.data);
          console.error(error.response);
        } else {
          console.error("Error encountered", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceFilter();
  }, []);

  return (
    <div className="w-full">
      <div>
        <div className="bg-white shadow-md border-b border-gray-200 px-8 py-4 flex flex-wrap gap-4 justify-between items-center">
          <h3 className="text-xl md:text-2xl lg:text-3xl text-gray-800 text-center sm:text-left flex-1">
            Sentiment Analysis Dashboard
          </h3>
          <div>
            <DashboardFilter
              dateRange={dateRange}
              setDateRange={setDateRange}
              serviceNameArray={serviceName}
              serviceTypeArray={serviceType}
              setFilterServiceNameArray={setFilterServiceNameArray}
              setFilterServiceTypeArray={setFilterServiceTypeArray}
            />
            <Button
              className="text-white bg-blue-700 hover:bg-blue-500 hover:text-white ml-5"
              variant="outline"
              onClick={() => alert("Hello world!")}
            >
              <Download />
              <span className="hidden md:inline">Export</span>
            </Button>
          </div>
        </div>
      </div>
      {/* Applied filter section*/}
      <div className="text-muted-foreground px-8 py-2 break-words">
        {isLoading ? (
          <span>Loading dashboard filters...</span>
        ) : !(
            dateRange ||
            filterServiceNameArray.length > 0 ||
            filterServiceTypeArray.length > 0
          ) ? (
          "No filters applied"
        ) : (
          <span>
            Filters shown for {"   "}
            {/* Service names filter */}
            {filterServiceNameArray.length > 0 &&
            filterServiceNameArray.length === serviceName.length
              ? " All services names selected"
              : filterServiceNameArray.join(", ")}
            {/* Separator between the service names and service types */}
            {filterServiceNameArray.length > 0 &&
              filterServiceTypeArray.length > 0 &&
              " - "}
            {/* Service type filter */}
            {filterServiceTypeArray.length > 0 &&
            filterServiceTypeArray.length === serviceType.length
              ? "All service types selected"
              : filterServiceTypeArray.join(", ")}
            {/* Separator between the service types date range */}
            {(filterServiceNameArray.length > 0 ||
              filterServiceTypeArray.length > 0) &&
              dateRange &&
              " - "}
            {dateRange
              ? `${dateRange.from?.toLocaleDateString()} to ${dateRange.to?.toLocaleDateString()}`
              : ""}
          </span>
        )}
      </div>

      {/* Dashboard section*/}
      <main className="scale-85 origin-top flex flex-col lg:flex-row">
        <div className="flex flex-col w-full lg:w-1/2 mr-5">
          <div className="h-[400px] rounded-md shadow-lg mt-20 p-10">
            <div className="flex justify-center items-center h-[250px]">
              <div className="h-[330px] w-[400px]">
                <Gauge filterParams={filterParams} />
              </div>
            </div>
          </div>
          <div className="h-[400px] rounded-md shadow-lg mt-10 p-4">
            <Service filterParams={filterParams} />
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-1/2 lg:ml-5 pb-10">
          <div className="h-[400px] rounded-md shadow-lg mt-20 p-4">
            <Gender filterParams={filterParams} />
          </div>
          <div className="h-[400px] rounded-md shadow-lg mt-10 p-4"></div>
        </div>
      </main>
    </div>
  );
}

export default GuestDashboard;
