import OverallSentimentGauge from "../Components/dashboard_components/gauge";
import SentimentByGender from "../Components/dashboard_components/gender";
import SentimentByService from "../Components/dashboard_components/service";
import ImprovementsTable from "../Components/dashboard_components/table";
import {
  BarChart3,
  Users,
  Settings,
  Home,
  Archive,
  Filter,
  Download,
  LogOut,
} from "lucide-react";

const genderServices = [
  {
    male: { neg: 5, neu: 15, pos: 80 },
    female: { neg: 3, neu: 12, pos: 85 },
  },
];

const services = [
  {
    name: "Tour and Orientation",
    male: { neg: 5, neu: 15, pos: 80 },
    female: { neg: 3, neu: 12, pos: 85 },
    service: { neg: 8, neu: 20, pos: 72 },
  },
  {
    name: "Hybrid Seminar",
    male: { neg: 8, neu: 22, pos: 70 },
    female: { neg: 6, neu: 18, pos: 76 },
    service: { neg: 5, neu: 15, pos: 80 },
  },
  {
    name: "Material Request",
    male: { neg: 10, neu: 25, pos: 65 },
    female: { neg: 12, neu: 20, pos: 68 },
    service: { neg: 8, neu: 22, pos: 70 },
  },
  {
    name: "Offline Library Literacy Program",
    male: { neg: 7, neu: 23, pos: 70 },
    female: { neg: 5, neu: 20, pos: 75 },
    service: { neg: 4, neu: 8, pos: 88 },
  },
];

const improvements = [
  { area: "Internet Infrastructure", percent: 34 },
  { area: "Digital Literacy", percent: 25 },
  { area: "Cost of Technology", percent: 17 },
  { area: "Cloud Complexity", percent: 13 },
  { area: "Inclusivity and Access", percent: 8 },
];

const stats = [
  {
    label: "Total Responses",
    value: "2,847",
    icon: Users,
    color: "bg-blue-500",
  },
];

const MainDashboardLayout = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid flex text-center justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-5 border border-gray-200 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Overall Sentiment Gauge (left) */}
        <OverallSentimentGauge />

        {/* Sentiment by Gender (right, slightly moved right) */}

        <div className="w-full">
          <SentimentByGender />
        </div>
      </div>

      {/* Sentiment by Service */}
      <SentimentByService />

      {/* Improvements Table */}
      <ImprovementsTable improvements={improvements} />
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <div className="w-screen h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-2xl border-r border-gray-200 flex flex-col z-20">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-5 h-5 bg-white rounded-md"></div>
            </div>
            <span className="font-bold text-gray-800 text-lg">
              DOST-CitiSense
            </span>
          </div>
        </div>
        <nav className="mt-8 flex-1">
          <div className="px-6 py-3 text-gray-600 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors duration-200">
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </div>
          <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 cursor-pointer flex items-center space-x-3 border-r-4 border-blue-500">
            <BarChart3 className="w-5 h-5" />
            <span className="font-semibold">Dashboard</span>
          </div>
          <div className="px-6 py-3 text-gray-600 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 transition-colors duration-200">
            <Archive className="w-5 h-5" />
            <span className="font-medium">Archive</span>
          </div>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header (Top Nav) */}
        <div className="bg-white shadow-md border-b border-gray-200 px-8 py-4 flex flex-wrap gap-4 justify-between items-center z-10">
          <div>
            <h3
              className="text-3xl text-gray-800
"
            >
              Sentiment Analysis Dashboard
            </h3>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-100">
          <MainDashboardLayout />
        </div>
      </div>
    </div>
  );
};

export default App;
