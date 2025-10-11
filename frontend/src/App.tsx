import { Outlet } from "react-router-dom";
import {
  BarChart3,
  Settings,
  Home,
  Archive,
  Filter,
  Download,
} from "lucide-react";

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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;
