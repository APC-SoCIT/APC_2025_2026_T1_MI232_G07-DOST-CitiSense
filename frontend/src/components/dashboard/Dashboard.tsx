import Gauge from "../charts/gauge";
import Service from "../charts/service";
import Gender from "../charts/gender";
import { Button } from "../ui/button";
import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import { SentimentPostType } from "../table/TableColumns";
import { Download, Loader2, RefreshCcw } from "lucide-react";
import axios from "axios";
import DashboardFilter from "./DashboardFilter";
import { type DateRange } from "react-day-picker";
import { format, formatDistanceToNow } from "date-fns";
import { serviceNames } from "../../mockdata/fakeServiceFilter";
import { sentimentFeedbackDataProps } from "../../types/DashboardProps";
import ChatbotUI from "./chatbot/chatbotui";

function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    try {
      const parsedDate = JSON.parse(
        localStorage.getItem("dateRangeFilter") || ""
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
  // const [filterServiceNameArray, setFilterServiceNameArray] = useState([]);
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
  // const [filterServiceTypeArray, setFilterServiceTypeArray] = useState([]);
  const [serviceName, setServiceName] = useState<string[]>([]); // This contains the unique service names
  const [serviceType, setServiceType] = useState<string[]>([]); // This contains the unique service types

  const [isSpinning, setIsSpinning] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null); // For the last refreshed x minutes ago message
  const [tick, setTick] = useState(0); // State for manually refreshing the page every minute, for the {x} value inside the last refreshed message
  const [refreshCharts, setRefreshCharts] = useState(0); // State for refreshing the charts, when user clicked refresh dashboard button
  const [chartsLoading, setChartsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("dateRangeFilter", JSON.stringify(dateRange));
    localStorage.setItem(
      "serviceNameFilter",
      JSON.stringify(filterServiceNameArray)
    );

    localStorage.setItem(
      "serviceTypeFilter",
      JSON.stringify(filterServiceTypeArray)
    );

    console.log("Printing filters");
  }, [filterServiceNameArray, filterServiceTypeArray, dateRange]);

  // These are the filter parameters to be included in the URL.
  const filterParams = useMemo(() => {
    // Instantiate an URLSearchParam,this will hold all the filter values to be sent to the backend
    const params = new URLSearchParams();

    // Convert the shownFilters array into URL parameters and convert them to a string.
    filterServiceNameArray.forEach((serviceName) =>
      params.append("service_name", serviceName)
    );
    filterServiceTypeArray.forEach((serviceType) =>
      params.append("service_type", serviceType)
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

  const fetchServiceFilter = async () => {
    setIsLoading(true);
    try {
      // Get all the feedback results
      const sentimentFeedbackResults = await api.get(
        "sentimentposts/dashboardfilters/"
      );

      const sentimentFeedbackData: sentimentFeedbackDataProps =
        sentimentFeedbackResults.data;

      // Get the service_name part of the response
      const serviceNames = sentimentFeedbackData.service_name;

      // Get the service_type part of the response
      const serviceTypes = sentimentFeedbackData.service_type;

      // Sort the arrays alphabetically, and filter out null values
      const serviceFilterNameArray = serviceNames
        .filter((item) => item !== null && item !== undefined)
        .sort((a, b) => a.localeCompare(b));
      const serviceFilterTypeArray = serviceTypes
        .filter((item) => item !== null && item !== undefined)
        .sort((a, b) => a.localeCompare(b));
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

  // For animating and disabling the refresh button based on the fetchServiceFilter function
  const handleRefresh = async () => {
    setIsSpinning(true);
    await fetchServiceFilter();
    setLastRefreshed(new Date()); // This is for the formatDistanceToNow code, to calculate the current time when the refresh button is clicked
    setRefreshCharts((prev) => prev + 1);
    setIsSpinning(false);
    console.log("Dashboard is refreshed");
  };

  // UseEffect for manually triggering a refresh every 60 seconds; for rendering the formatDistanceToNow code
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((x) => x + 1);
      console.log("setTick is ran");
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // UseEffect for the loader icon when user clicks the refresh button or applies a new filter
  useEffect(() => {
    setChartsLoading(true);
    const timeout = setTimeout(() => {
      setChartsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [filterParams, lastRefreshed]);

  return (
    <div className="w-full">
      <div>
        <div className="bg-white shadow-md border-b border-gray-200 px-8 py-4 flex flex-wrap gap-4 justify-between items-center">
          <h3 className="text-xl md:text-2xl lg:text-3xl text-gray-800 text-center sm:text-left flex-1">
            Sentiment Analysis Dashboard
          </h3>
          <div>
            <span className="hidden md:inline mr-2 whitespace-nowrap rounded-md text-sm font-medium transition-all ">
              {lastRefreshed
                ? `Last refreshed ${formatDistanceToNow(lastRefreshed, {
                    addSuffix: true,
                  })}`
                : ""}
            </span>
            <Button
              size="icon"
              className="rounded-full mr-4"
              variant="ghost"
              disabled={isSpinning}
              onClick={() => {
                handleRefresh();
              }}
            >
              <RefreshCcw
                className={`w-24 h-24 ${isSpinning ? "animate-spin" : ""}`}
              />
            </Button>

            <DashboardFilter
              dateRange={dateRange}
              setDateRange={setDateRange}
              serviceNameArray={serviceName}
              serviceTypeArray={serviceType}
              setFilterServiceNameArray={setFilterServiceNameArray}
              setFilterServiceTypeArray={setFilterServiceTypeArray}
            />
            <Button
              className="text-white bg-blue-700 hover:bg-blue-500 hover:text-white ml-4"
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
      {chartsLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="w-20 h-20 animate-spin" />
        </div>
      ) : (
        <main className="scale-85 origin-top flex flex-col lg:flex-row">
          <div className="flex flex-col w-full lg:w-1/2 mr-5">
            <div className="h-[400px] rounded-md shadow-lg mt-20 p-10">
              <div className="flex justify-center items-center h-[250px]">
                <div className="h-[330px] w-[400px]">
                  <Gauge
                    filterParams={filterParams}
                    refreshCharts={refreshCharts}
                  />
                </div>
              </div>
            </div>
            <div className="h-[400px] rounded-md shadow-lg mt-10 p-4">
              <Service
                filterParams={filterParams}
                refreshCharts={refreshCharts}
              />
            </div>
          </div>

          <div className="flex flex-col w-full lg:w-1/2 lg:ml-5 pb-10">
            <div className="h-[400px] rounded-md shadow-lg mt-20 p-4">
              <Gender
                filterParams={filterParams}
                refreshCharts={refreshCharts}
              />
            </div>
            <div className="h-[400px] rounded-md shadow-lg mt-10 p-4"></div>
          </div>
        </main>
      )}
      <ChatbotUI />
    </div>
  );
}

export default DashboardPage;
