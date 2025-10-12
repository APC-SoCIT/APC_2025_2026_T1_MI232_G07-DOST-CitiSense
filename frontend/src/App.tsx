import { Settings, Filter, Download } from "lucide-react";
import MainDashboardLayout from "./pages/dashboard";

const App = () => {
  return (
    <div className="w-full h-screen flex bg-gray-100 font-sans overflow-hidden">
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header (Top Nav) */}
        <div className="bg-white shadow-md border-b border-gray-200 px-8 py-4 flex flex-wrap gap-4 justify-between items-center z-10">
          <h3 className="text-3xl text-gray-800">
            Sentiment Analysis Dashboard
          </h3>
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
          <MainDashboardLayout />
        </div>
      </div>
    </div>
  );
};

export default App;
