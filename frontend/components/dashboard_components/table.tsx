type ImprovementType = { area: string; percent: number };

const ImprovementsTable = ({
  improvements,
}: {
  improvements: ImprovementType[];
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Thematic Analysis of Suggested Improvements
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Areas of Improvement
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody>
            {improvements.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4 text-sm text-gray-700">{item.area}</td>
                <td className="py-4 px-4 text-sm font-medium text-gray-800">
                  {item.percent}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ImprovementsTable;
