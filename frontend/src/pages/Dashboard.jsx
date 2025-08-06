import Gauge from "../components/charts/gauge";
import Service from "../components/charts/service";
import Gender from "../components/charts/gender";

function Dashboard() {
  return (
    <main className="scale-80 origin-top flex justify-center flex-col lg:flex-row">
      <div className="flex flex-col w-full lg:w-1/2 mr-5">
        <div className="h-[400px] rounded-md shadow mt-20 p-10">
          <h1 className="font-sans text-base font-bold text-center mb-10">
            Overall Sentiment
          </h1>
          <div className="flex justify-center items-center h-[250px]">
            <div className="h-[330px] w-[400px]">
              <Gauge />
            </div>
          </div>
        </div>
        <div className="h-[400px] rounded-md shadow mt-10 p-4">
          <Service />
        </div>
      </div>

      <div className="flex flex-col w-full lg:w-1/2 ml-5 pb-10">
        <div className="h-[400px] rounded-md shadow mt-20 p-4 ">
          <Gender />
        </div>
        <div className="h-[400px] rounded-md shadow mt-10 p-4 ">
          <Gender />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
