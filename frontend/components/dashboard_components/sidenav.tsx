import { Home, Archive, BarChart3 } from "lucide-react";

const SideNav = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="font-bold text-gray-800">DOST-CitiSense</span>
          </div>
        </div>
        <nav className="mt-8">
          <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer flex items-center space-x-3">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </div>
          <div className="px-4 py-2 bg-yellow-100 text-gray-800 cursor-pointer flex items-center space-x-3">
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </div>
          <div className="px-4 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer flex items-center space-x-3">
            <Archive className="w-5 h-5" />
            <span>Archive</span>
          </div>
        </nav>
      </div>
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <span className="text-lg font-bold text-gray-500">
          Dashboard Main Content
        </span>
      </div>
    </div>
  );
};

export default SideNav;
