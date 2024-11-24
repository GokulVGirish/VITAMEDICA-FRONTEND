import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  defaults,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { useEffect, useState } from "react";
import instance from "../../Axios/doctorInstance";
import { GiReceiveMoney } from "react-icons/gi";
import bg from "@/assets/bg-2.jpg";
import DigitalClock from "../extra/DIgitalClock";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const DoctorDash = () => {
  const [selectedPage, setSelectedPage] = useState<string>("Todays");
  const [todaysRevenue, setTodaysRevenue] = useState<number>(0);
  const [chartDataString, setChartDataString] = useState<
    { label: string; totalRevenue: number }[]
  >([]);
  const [chartDataNumber, setChartDataNumber] = useState<
    { label: number; totalRevenue: number }[]
  >([]);
  const [appointCountInfo, setAppointCountInfo] = useState<{
    appointmentsCount: number;
    cancellationsCount: number;
  }>();

  useEffect(() => {
    const fetchYearlyRevenue = async () => {
      try {
        let response;
        if (selectedPage === "Todays") {
          response = await instance.get(`/utility/dash/today`);
        } else if (selectedPage === "Weekly") {
          response = await instance.get(`/utility/dash/weekly`);
        } else if (selectedPage === "Monthly") {
          response = await instance.get(`/utility/dash/monthly`);
        } else {
          response = await instance.get(`/utility/dash/yearly`);
        }

        if (response?.data?.success) {
          if (selectedPage === "Todays") {
            setTodaysRevenue(response?.data?.data.revenue);
            setAppointCountInfo(response?.data?.data.count);
          } else if (selectedPage === "Weekly" || selectedPage === "Monthly") {
            setChartDataString(response?.data.data.revenue);
            setAppointCountInfo(response?.data?.data.count);
          } else {
            setChartDataNumber(response?.data.data.revenue);
            setAppointCountInfo(response?.data?.data.count);
          }
        }
      } catch (error) {
         setAppointCountInfo({ appointmentsCount: 0, cancellationsCount: 0 });
        console.error("Error fetching yearly revenue:", error);
      }
    };

    fetchYearlyRevenue();
  }, [selectedPage]);
  const revenueChart = {
    labels: !(selectedPage === "Yearly")
      ? chartDataString?.map((item) => item.label.toString())
      : chartDataNumber?.map((item) => item.label.toString()),
    datasets: [
      {
        label: `${selectedPage} Revenue`,
        data: !(selectedPage === "Yearly")
          ? chartDataString?.map((item) => item.totalRevenue)
          : chartDataNumber?.map((item) => item.totalRevenue.toString()),
        backgroundColor: "rgba(68, 181, 215, 0.5)",
        borderColor: "rgba(86, 170, 198, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(86, 170, 198, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        fill: true,
      },
    ],
  };

  const countChart = {
    labels: [
      `Appointments Booked ${appointCountInfo?.appointmentsCount || 0}`,
      `Appointments Cancelled ${appointCountInfo?.cancellationsCount || 0}`,
    ],
    datasets: [
      {
        label: "Count",
        data: [
          appointCountInfo?.appointmentsCount,
          appointCountInfo?.cancellationsCount,
        ],
        borderColor: ["rgba(54, 79, 107, 1)"],
        backgroundColor: ["rgba(86, 170, 198, 1)", "rgba(255, 102, 102, 1)"],

        borderRadius: 5,
      },
    ],
  };

  return (
    <main
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100%",
      }}
      className="flex min-h-screen flex-col items-center justify-center px-6 pt-20 pb-40"
    >
      <DigitalClock />

      <select
        onChange={(e) => setSelectedPage(e.target.value)}
        className="bg-gray-200 border border-gray-300 mt-10 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-[160px] p-2.5 shadow-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="Todays" >
          Todays
        </option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
        <option value="Yearly">Yearly</option>
      </select>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[1200px] mt-10">
        {selectedPage === "Todays" ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-lg h-[400px] bg-gradient-to-br from-blue-50 to-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedPage} Revenue
            </h3>
            <div className="flex items-center space-x-6">
              <GiReceiveMoney size={80} className="text-gray-800 opacity-80" />
              <div className="text-left">
                <h1 className="text-3xl font-bold text-gray-800 border-l-4 border-[#56aac6] pl-3">
                  {selectedPage} Revenue
                </h1>
                <p className="text-2xl font-bold text-gray-700 bg-gray-50  px-4 py-2 mt-2 rounded-md ">
                  ₹{todaysRevenue || "0"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 rounded-lg h-[400px] bg-gradient-to-br from-blue-50 to-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {selectedPage} Revenue
            </h3>
            <Line data={revenueChart} className="w-full max-w-[90%]" />
          </div>
        )}

        <div className="flex flex-col items-center justify-center p-8 rounded-lg h-[400px] bg-gradient-to-br from-blue-50 to-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {selectedPage} Appointments & Cancellations
          </h3>
          <Doughnut data={countChart} className="w-full max-w-[90%]" />
        </div>
      </div>
    </main>
  );
};

export default DoctorDash;
