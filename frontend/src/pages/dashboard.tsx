import Gauge from "../components/DashboardComponents/gauge";
import Gender from "../components/DashboardComponents/gender";
import Service from "../components/DashboardComponents/service";
import ImprovementsTable from "../components/DashboardComponents/table";
import { Users } from "lucide-react";

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
        <Gauge />

        <div className="w-full">
          <Gender />
        </div>
      </div>

      <Service />

      <ImprovementsTable improvements={improvements} />
    </div>
  );
};

export default MainDashboardLayout;
