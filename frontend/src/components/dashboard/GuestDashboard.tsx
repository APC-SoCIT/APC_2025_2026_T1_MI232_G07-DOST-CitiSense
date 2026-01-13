import Gauge from "../charts/gauge";
import Service from "../charts/service";
import Gender from "../charts/gender";
import { Button } from "../ui/button";
import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import DashboardDropdown from "./DashboardDropdown";
import { SentimentPostType } from "../table/TableColumns";
import { Download } from "lucide-react";
import axios from "axios";
import DashboardFilter from "./DashboardFilter";
import { type DateRange } from "react-day-picker";

function GuestDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [serviceItem, setServiceItem] = useState("");
  const [session, setSession] = useState<string[]>([]); //contains the session/quarter in the sentimentposts
  const [filterValue, setFilterValue] = useState<string[]>(() => {
    const savedDashboardFilters = localStorage.getItem("dashboardFilters"); //lazy initialization of the state from the saved filters from the localstorage
    return savedDashboardFilters ? JSON.parse(savedDashboardFilters) : [];
  }); //the array of values to be filtered

  //the filter parameters to be included in the url
  //filters out sessions in the 'filterValue' array and converts the remaining strings to url parameters
  //recomputes once filter value or session is updated
  const filterParams = useMemo(() => {
    const shownSession = session.filter(
      (session) => !filterValue.includes(session)
    );
    return new URLSearchParams(
      shownSession.map((session) => ["quarter", session])
    ).toString();
  }, [filterValue, session]);
  console.log(filterParams);

  //on mount fetch the session/quarter data
  useEffect(() => {
    fetchSession();
  }, []);

  useEffect(() => {
    localStorage.setItem("dashboardFilters", JSON.stringify(filterValue));
  }, [filterValue]);

  //fetches the session part of the sentiment post
  const fetchSession = async () => {
    try {
      const res = await api.get("sentimentposts/");

      //maps through the array and just gets the quarter part of the response
      const resSession = res.data.results.map(
        (item: SentimentPostType) => item.quarter
      );

      //convert the session array to set; this is so that the array only contain the unique values
      const sessions: Set<string> = new Set(resSession);

      //converts the session set back to array to be sorted and also to be put into session state
      const sessionArray = [...sessions].sort((a, b) => a.localeCompare(b));
      setSession(sessionArray);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        console.error(error.response);
      } else {
        console.error("Error encountered", error);
      }
    }
  };

  //this is where the filterValue is coming from
  const handleSelectChange = (quarter: string) => {
    let newFilterValue: string[] = [];

    //if the current unselected item from the dropdown is in the filter array, then remove it from the filter array
    if (filterValue.includes(quarter)) {
      newFilterValue = filterValue.filter(
        (filterWords) => filterWords !== quarter
      );

      //if the current selected item from the dropdown is not in the filter array then make a shallow copy and append the item in the filter array
    } else {
      newFilterValue = [...filterValue, quarter];
    }
    //finally set the filter value to whatever the newFilterValue gets set to
    setFilterValue(newFilterValue);
  };

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
              serviceItem={serviceItem}
              setServiceItem={setServiceItem}
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
      <div className="text-muted-foreground px-8 py-2">
        {dateRange || serviceItem ? (
          <span>
            Filters shown for {serviceItem && serviceItem}
            {serviceItem && dateRange && " - "}
            {dateRange &&
              `${dateRange.from?.toLocaleDateString()} to ${dateRange.from?.toLocaleDateString()}`}
          </span>
        ) : (
          "No filters applied"
        )}
      </div>

      {/* Dashboard section; charts*/}
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

        <div className="flex flex-col w-full lg:w-1/2 ml-5 pb-10">
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
