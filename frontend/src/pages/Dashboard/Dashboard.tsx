import Gauge from "../../components/dashboard/charts/gauge";
import ChatbotUI from "../../components/dashboard/chatbot/chatbotui";
import Service from "../../components/dashboard/charts/service";
import Gender from "../../components/dashboard/charts/gender";
import SentimentTrends from "../../components/dashboard/charts/sentimenttrends";
import { Button } from "../../components/ui/button";
import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import { Download, Loader2, RefreshCcw } from "lucide-react";
import axios from "axios";
import DashboardFilter from "../../components/dashboard/DashboardFilter";
import { type DateRange } from "react-day-picker";
import { format, formatDistanceToNow } from "date-fns";
import { serviceNames } from "../../mockdata/fakeServiceFilter";
import type { sentimentFeedbackDataProps } from "../../types/DashboardProps";
import DashboardSettings from "../../components/dashboard/dashboardtools/DashboardSettings";
import type {
  GenderTooltipDataProps,
  ServiceTooltipDataProps,
  serviceMap,
  themeDataProps,
} from "../../types/ChartsProps";
import ThematicAnalysisTable, {
  fallbackThemes,
} from "../../components/dashboard/charts/ThematicAnalysis";

import useDashboardCharts from "@/hooks/useDashboardCharts";

function DashboardPage() {
  const [themes, setThemes] = useState<themeDataProps[]>(fallbackThemes); // To hold the values for the thematic analysis table
  const [isThemesLoading, setIsThemesLoading] = useState(false);
  const [uniqueServiceType, setUniqueServiceType] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  const [showCustomTooltip, setShowCustomtoolTip] = useState(false); // For rendering the normal tooltip on mount. Then on generating summaries, show the custom tooltip
  const [serviceTooltip, setServiceTooltip] = useState<string[][]>([]);
  const [serviceTooltipCount, setServiceTooltipCount] = useState<number[][]>(
    [],
  ); // State to count how many service text got summarized by the AI
  const [serviceTooltipLoading, setServiceTooltipLoading] =
    useState<boolean>(false);
  const [genderTooltip, setGenderTooltip] = useState<string[][]>([]);
  const [genderTooltipCount, setGenderTooltipCount] = useState<number[][]>([]); // State to count how many gender text got summarized by the AI
  const [isGenderTooltipLoading, setIsGenderTooltipLoading] = useState(false);
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
  const [refreshCharts, setRefreshCharts] = useState(0); // State for refreshing the charts in their respective useEffects, when user clicks the refresh dashboard button
  const [chartsLoading, setChartsLoading] = useState(false);

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

    const allServiceNameSelected =
      filterServiceNameArray.length === serviceName.length;
    const allServiceTypeSelected =
      filterServiceTypeArray.length === serviceType.length;

    // Only add service_name filters if not all selected
    // Convert the shownFilters array into URL parameters and convert them to a string.
    if (!allServiceNameSelected) {
      filterServiceNameArray.forEach((serviceName) =>
        params.append("service_name", serviceName),
      );
    }
    // Only add service_type filters if not all selected
    if (!allServiceTypeSelected) {
      filterServiceTypeArray.forEach((serviceType) =>
        params.append("service_type", serviceType),
      );
    }

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
        "sentimentposts/dashboardfilters/",
      );
      // To get the service types to be passed on to the service chart; for dynamically rendering service types
      setUniqueServiceType(sentimentFeedbackResults.data.service_type);

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

  // On mount, fetch the filter values, and refresh the charts
  useEffect(() => {
    fetchServiceFilter();
    setRefreshCharts((prev) => prev + 1);
  }, []);

  // This is to reset the tooltip values, and fetch the totalCount() once the filters change.
  useEffect(() => {
    setGenderTooltip([]);
    setServiceTooltip([]);
    setThemes(fallbackThemes);
    fetchTotalCount();
  }, [filterParams]);

  // For animating and disabling the refresh button based on the fetchServiceFilter function
  const handleRefresh = async () => {
    setIsSpinning(true);
    await fetchServiceFilter();
    await fetchTotalCount();
    setLastRefreshed(new Date()); // This is for the formatDistanceToNow code, to calculate the current time when the refresh button is clicked
    setRefreshCharts((prev) => prev + 1);
    setIsSpinning(false);
    console.log("Dashboard is refreshed");
  };

  // UseEffect for manually updating the refresh message every 60 seconds; for rendering the formatDistanceToNow code
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

  // Fetch total count for guest dashboard
  const fetchTotalCount = async () => {
    try {
      const res = await api.get(`/sentimentposts/totalcount/?${filterParams}`);
      setTotalCount(res.data.totalcount || 0);
    } catch (error) {
      setTotalCount(null);
      console.error("Error fetching total count", error);
    }
  };

  const getGenderTooltip = async (limit: number) => {
    try {
      setIsGenderTooltipLoading(true);
      const res = await api.get(
        `/sentimentposts/gendertooltip/?limit=${limit}&offset=0&${filterParams}`,
      );
      const resData = res.data.genderTooltip;

      let genderSummaryCount = {
        Negative: [0, 0],
        Neutral: [0, 0],
        Positive: [0, 0],
      };

      // Used to store the current summary for each sentiment and each gender category
      let genderSummary = {
        Negative: ["", ""],
        Neutral: ["", ""],
        Positive: ["", ""],
      };

      // Transform the data, and put the each summary in their respective genderSummary dictionary.
      resData.forEach((item: GenderTooltipDataProps) => {
        // Assign an index for both sex (e.g., Female = 0, Male = 1)
        const index = item.sex === "Female" ? 0 : 1;
        // Access the current sentiment within the loop in the genderSummary/count dictionary, then use the index of the gender to place the summary text
        // e.g., item.sentiment is 0 = Negative, the index is 0 = Female. So genderSummary["Negative"][0] = summary text / summary text count
        genderSummary[item.sentiment][index] = item.summary;
        genderSummaryCount[item.sentiment][index] = item.count;
      });

      // Just get the values from the genderSummaryCount and genderSummary dictionary of lists
      setGenderTooltipCount(Object.values(genderSummaryCount));
      setGenderTooltip(Object.values(genderSummary));
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setIsGenderTooltipLoading(false);
    }
  };

  const getServiceTooltip = async (limit: number) => {
    try {
      setServiceTooltipLoading(true);

      const res = await api.get(
        `/sentimentposts/servicetooltip/?limit=${limit}&offset=0&${filterParams}`,
      );
      const resData = res.data.serviceTooltip;

      // Get the unique values using set, and then convert it back to an array
      const serviceResData = Array.from(
        new Set(
          (res.data.serviceTooltip as ServiceTooltipDataProps[]).map(
            (item: any) => item.service,
          ),
        ),
      );

      // Get the length of the array
      const size = serviceResData.length;

      // Initialize an empty dictionary and put the current service in the loop, along with its index
      const dynamicServiceMap: Record<string, number> = {};
      serviceResData.forEach((service, index) => {
        dynamicServiceMap[service] = index;
      });

      // Reference: https://stackoverflow.com/a/44172015
      // Used to store the current summary for each sentiment and each service category
      let serviceSummary = {
        Negative: Array(size).fill(""),
        Neutral: Array(size).fill(""),
        Positive: Array(size).fill(""),
      };
      // Create an array filled with zeroes based on the serviceType count
      let serviceSummaryCount = {
        Negative: Array(size).fill(0),
        Neutral: Array(size).fill(0),
        Positive: Array(size).fill(0),
      };

      // Transform the data, and put the each summary in their respective serviceSummary dictionary
      resData.forEach((item: ServiceTooltipDataProps) => {
        // Get the current index from the serviceMap
        const index = dynamicServiceMap[item.service];

        // Access the current sentiment within the loop in the serviceSumary dictionary, then use the index of the service to place the summary text
        // e.g., item.sentiment is 0 = Negative, the index is 0 = Hybrid Seminar. So serviceSummary["Negative"][0] = summary text / summary count
        serviceSummary[item.sentiment][index] = item.summary;
        serviceSummaryCount[item.sentiment][index] = item.count;
      });

      // Get only the values of the serviceSummary (not the key)
      setServiceTooltip(Object.values(serviceSummary));
      setServiceTooltipCount(Object.values(serviceSummaryCount));
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setServiceTooltipLoading(false);
    }
  };

  // Get the most common topics talked about. This depends on the filters selected
  const getThemes = async (limit: number) => {
    setIsThemesLoading(true);
    try {
      const res = await api.get(
        `sentimentposts/themes/?limit=${limit}&offset=0&${filterParams}`,
      );
      const resData = res.data.themeCount;
      setThemes(resData);
    } catch (error) {
      console.error("This is the thematic analysis error", error);
    } finally {
      setIsThemesLoading(false);
    }
  };

  // Get the chart values from the useDashboardCharts.ts file, and also pass the filterParams and refreshCharts.
  const { gaugeValue, genderTypes, genderValue, serviceTypes, serviceValue } =
    useDashboardCharts({ filterParams, refreshCharts });

  return isGenderTooltipLoading || serviceTooltipLoading || isThemesLoading ? (
    <div className="flex flex-col justify-center items-center min-h-screen mt-5">
      <Loader2 className="w-20 h-20 animate-spin" />
      <p className="text-gray-600 text-lg">Generating AI summaries/themes...</p>
      <p className="text-gray-500 text-xs text-center max-w-sm mt-1">
        This may take a moment. AI-generated content may contain inaccuracies.
      </p>
    </div>
  ) : (
    <div className="w-full">
      <div>
        <div className="bg-white shadow-md border-b border-gray-200 px-8 py-4 flex flex-wrap gap-4 justify-center md:justify-between items-center">
          <h3 className="text-xl md:text-2xl lg:text-3xl text-gray-800 text-center whitespace-nowrap rounded-md font-medium sm:text-left flex flex-col md:flex-row">
            Sentiment Analysis Dashboard
            {typeof totalCount === "number" && (
              <span className="ml-4 md:mt-1.5 text-lg text-blue-600 font-semibold">
                Total Responses: {totalCount?.toLocaleString() ?? 0}
              </span>
            )}
          </h3>
          <div className="flex flex-row justify-center items-center gap-2 md:gap-4">
            <span className="hidden md:inline mr-2 whitespace-nowrap rounded-md text-sm font-medium transition-all ">
              {lastRefreshed
                ? `Last refreshed ${formatDistanceToNow(lastRefreshed, { addSuffix: true })}`
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
              filterServiceNameArray={filterServiceNameArray}
              filterServiceTypeArray={filterServiceTypeArray}
              setFilterServiceNameArray={setFilterServiceNameArray}
              setFilterServiceTypeArray={setFilterServiceTypeArray}
            />
            <DashboardSettings
              getGenderTooltip={getGenderTooltip}
              isGenderTooltipLoading={isGenderTooltipLoading}
              getServiceTooltip={getServiceTooltip}
              isServiceTooltipLoading={serviceTooltipLoading}
              setShowCustomTooltip={setShowCustomtoolTip}
              getThemes={getThemes}
              totalCount={totalCount}
              gaugeValue={gaugeValue}
              genderValue={genderValue}
              serviceValue={serviceValue}
            />
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
              ? " all services names selected"
              : filterServiceNameArray.join(", ")}
            {/* Separator between the service names and service types */}
            {filterServiceNameArray.length > 0 &&
              filterServiceTypeArray.length > 0 &&
              " - "}
            {/* Service type filter */}
            {filterServiceTypeArray.length > 0 &&
            filterServiceTypeArray.length === serviceType.length
              ? "all service types selected"
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
      {/* Dashboard section */}
      {chartsLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="w-20 h-20 animate-spin" />
        </div>
      ) : (
        /* Wrap main in a div that hides the overflow or handles the height collapse */
        <div className="overflow-hidden">
          <main className="scale-85 origin-top p-4 -mb-[15vh]">
            {" "}
            {/* Added negative margin-bottom to pull the bottom up */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-[400px] rounded-md shadow-lg p-10 flex justify-center items-center">
                <div className="h-[] w-[400px]">
                  <Gauge gaugeValue={gaugeValue} />
                </div>
              </div>

              <div className="h-[400px] rounded-md shadow-lg p-4">
                <Gender
                  filterParams={filterParams}
                  refreshCharts={refreshCharts}
                  genderTooltip={genderTooltip}
                  isGenderTooltipLoading={isGenderTooltipLoading}
                  genderTooltipCount={genderTooltipCount}
                  showCustomTooltip={showCustomTooltip}
                  genderTypes={genderTypes}
                  genderValue={genderValue}
                />
              </div>

              <div className="h-[400px] rounded-md shadow-lg p-4">
                <Service
                  filterParams={filterParams}
                  refreshCharts={refreshCharts}
                  serviceTooltip={serviceTooltip}
                  serviceTooltipLoading={serviceTooltipLoading}
                  serviceTooltipCount={serviceTooltipCount}
                  showCustomTooltip={showCustomTooltip}
                  uniqueServiceType={uniqueServiceType}
                  serviceTypes={serviceTypes}
                  serviceValue={serviceValue}
                />
              </div>

              <div className="h-[400px] rounded-md shadow-lg p-4">
                <ThematicAnalysisTable themes={themes} />
              </div>

              <div className="lg:col-span-2 h-[400px] rounded-md shadow-lg p-4 w-full">
                <SentimentTrends
                  filterParams={filterParams}
                  refreshCharts={refreshCharts}
                />
              </div>
            </div>
          </main>
        </div>
      )}{" "}
      <ChatbotUI />
    </div>
  );
}

export default DashboardPage;
