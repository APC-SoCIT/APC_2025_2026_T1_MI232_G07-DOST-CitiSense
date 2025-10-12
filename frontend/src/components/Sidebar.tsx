import { BarChart3, Table } from "lucide-react";
const Sidebar = () => {
  return (
    //Sidebar
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
          <Table className="w-5 h-5" />
          <span className="font-medium">Data Table</span>
        </div>
        <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 cursor-pointer flex items-center space-x-3 border-r-4 border-blue-500">
          <BarChart3 className="w-5 h-5" />
          <span className="font-semibold">Dashboard</span>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
