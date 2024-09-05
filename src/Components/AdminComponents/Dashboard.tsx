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
import { Line, Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import adminInstance from "../../Axios/adminInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserDoctor,faPersonHalfDress,faPerson } from "@fortawesome/free-solid-svg-icons";
import { GiReceiveMoney } from "react-icons/gi";
import { GiPayMoney } from "react-icons/gi";
import { motion } from "framer-motion";
import { IoIosPeople } from "react-icons/io";

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

const AdminDash = () => {
  const [selectedPage, setSelectedPage] = useState<string>("Todays");

   const [todaysRevenue,setTodaysRevenue]=useState<number>(0)
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
  const [unverifiedDoctors,setUnverifiedDoctors]=useState(0)
  const [doctors,setDoctors]=useState(0)
  const [users,setUsers]=useState(0)

  const [totalRefund,setTotalRefund]=useState<{total:number,count:number}>()
  const [totalWithdrawals,setTotalWithdrawals]=useState<{total:number,count:number}>()
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (selectedPage === "Todays") {
            console.log("inside")
        response=await adminInstance.get(`/dashboard/today`)
        } else if (selectedPage === "Weekly") {
          response = await adminInstance.get(`/dashboard/weekly`);
        } else if (selectedPage === "Monthly") {
          response = await adminInstance.get(`/dashboard/monthly`);
        } else if (selectedPage === "Yearly") {
          response = await adminInstance.get("/dashboard/yearly");
        }
        if(selectedPage==="Todays"){
            console.log(response)
            setTodaysRevenue(response?.data.revenue)
            setAppointCountInfo(response?.data.count);
            setUnverifiedDoctors(response?.data.unverifiedDocs)
            setDoctors(response?.data.doctors)
            setUsers(response?.data.users)
            setTotalRefund(response?.data.refunds)
            setTotalWithdrawals(response?.data.withdrawals)
       
        }
        else if (
          response?.data.success &&
          (selectedPage === "Weekly" || selectedPage === "Monthly")
        ) {
          setChartDataString(response?.data.revenue);
          setAppointCountInfo(response?.data.count);
          setTotalRefund(response?.data.refunds);
          setTotalWithdrawals(response?.data.withdrawals);
        } else if (selectedPage === "Yearly") {
          setChartDataString([]);
          setChartDataNumber(response?.data.revenue);
          setTotalRefund(response?.data.refunds);
          setTotalWithdrawals(response?.data.withdrawals);
        }
      } catch (error) {
        console.error("Error fetching yearly revenue:", error);
      }
    };
    fetchData();
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
        borderColor: "rgba(68, 181, 215, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(68, 181, 215, 1)",
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
        backgroundColor: ["rgba(68, 181, 215, 0.8)", "rgba(255, 99, 132, 0.8)"],

        borderRadius: 5,
      },
    ],
  };
  console.log("selecedpg", selectedPage);
  console.log("rfr", chartDataString);
return (
  <main className="flex min-h-screen flex-col items-center justify-center px-2 py-3">
    <div className="h-[10vh] w-full max-w-[1200px] mb-6">
      <div className="grid gap-4 lg:gap-8 md:grid-cols-3 p-2">
        <div className="relative p-4 rounded-2xl bg-gray-700 shadow ">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium text-gray-500 dark:text-gray-400">
              <div>
                <FontAwesomeIcon className="h-8" icon={faPersonHalfDress} />{" "}
                <span className="text-base ml-2">Unverified Doctors</span>
              </div>
            </div>
            <div className="text-2xl dark:text-gray-100">
              {unverifiedDoctors}
            </div>
          </div>
        </div>

        <div className="relative p-4 rounded-2xl  bg-gray-700 shadow ">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium text-gray-500 dark:text-gray-400">
              <div>
                <FontAwesomeIcon className="h-8" icon={faUserDoctor} />{" "}
                <span className="text-base ml-2">Doctors</span>
              </div>
            </div>
            <div className="text-2xl dark:text-gray-100">{doctors}</div>
          </div>
        </div>

        <div className="relative p-4 rounded-2xl  bg-gray-700 shadow ">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium text-gray-500 dark:text-gray-400">
              <div>
                <FontAwesomeIcon className="h-8" icon={faPerson} />{" "}
                <span className="text-base ml-2">Users</span>
              </div>
            </div>
            <div className="text-2xl dark:text-gray-100">{users}</div>
          </div>
        </div>
      </div>
    </div>

    <select
      onChange={(e) => setSelectedPage(e.target.value)}
      className="bg-gray-50 border mt-6 border-gray-300  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[150px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      <option value="Todays" selected>
        Todays
      </option>
      <option value="Weekly">Weekly</option>
      <option value="Monthly">Monthly</option>
      <option value="Yearly">Yearly</option>
    </select>

    <motion.div
      className="grid md:grid-cols-4 md:grid-rows-2 w-full max-w-[1200px] mt-4 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex flex-col col-start-1 col-end-3 mt-2 items-center justify-center rounded-xl h-[30vh]"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center border w-full h-[86%] mb-2 border-gray-500 rounded-3xl p-4 bg-white">
          <GiReceiveMoney className="mx-5 text-[#364f6bde]" size={110} />
          <div className="flex flex-col justify-center items-start">
            <h1 className="text-3xl border-l-4 border-[#56aac6] pl-2 font-extrabold text-[#364f6b] mb-2">
              {selectedPage} Revenue
            </h1>
            <p className="text-2xl border-2 px-4 rounded-lg border-[#364f6b] bg-slate-100 font-bold text-[#364f6b]">
              ₹{" "}
              {(() => {
                if (selectedPage === "Yearly") {
                  return chartDataNumber?.reduce(
                    (acc, curr) => acc + curr.totalRevenue,
                    0
                  );
                } else if (selectedPage === "Todays") {
                  return todaysRevenue;
                } else {
                  return chartDataString?.reduce(
                    (acc, curr) => acc + curr.totalRevenue,
                    0
                  );
                }
              })()}
            </p>
          </div>
        </div>
      </motion.div>

      {!(selectedPage === "Todays") && (
        <motion.div
          className={`flex flex-col ${
            !(selectedPage === "Yearly")
              ? "col-start-3 col-end-5 h-[30vh]"
              : "col-start-1 col-end-5 row-start-2 h-[32vh]"
          } items-center justify-center p-4 rounded-xl`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex border w-full h-full mt-2 border-gray-500 rounded-3xl p-4 bg-white">
            <Line data={revenueChart} />
          </div>
        </motion.div>
      )}

      {!(selectedPage === "Yearly") && (
        <motion.div
          className="flex flex-col col-start-1 mt-6 col-end-3 row-start-2 items-center justify-start rounded-xl h-[26vh]"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex border w-full h-full border-gray-500 rounded-3xl p-4 bg-white">
            <Pie data={countChart} />
          </div>
        </motion.div>
      )}

      <motion.div
        className={`flex ${
          selectedPage === "Todays" || selectedPage === "Yearly"
            ? "row-start-1 row-end-2"
            : "row-start-2 row-end-3"
        } flex-col col-start-3 col-end-5 mt-2 items-center justify-center rounded-xl h-[30vh]`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="flex items-center border w-full h-[86%] mb-2 border-gray-500 rounded-3xl p-4 bg-white">
          <GiPayMoney className="mx-5 text-[#364f6bde]" size={110} />
          <div className="flex flex-col justify-center items-start">
            <h1 className="text-2xl border-l-4 border-[#fe819c] pl-2 font-extrabold text-[#364f6b] mb-2">
              {selectedPage} Refunds
            </h1>
            <div className=" flex gap-2">
              <p className="text-2xl border-2 px-4 rounded-lg border-[#364f6b] bg-slate-100 font-bold text-[#364f6b]">
                ₹{totalRefund?.total}
              </p>
              <div className="flex gap-2 text-[#364f6bde] self-end items-center">
                <IoIosPeople size={22} />
                <p className="text-xs font-semibold">{totalRefund?.count}</p>
              </div>
            </div>
            <h1 className="text-2xl border-l-4 mt-3 border-[#fe819c] pl-2 font-extrabold text-[#364f6b] mb-2">
              {selectedPage} Withdrawals
            </h1>
            <div className="flex gap-2">
              <p className="text-2xl border-2 px-4 rounded-lg border-[#364f6b] bg-slate-100 font-bold text-[#364f6b]">
                ₹{totalWithdrawals?.total}
              </p>
              <div className="flex text-[#364f6bde] gap-2 self-end items-center">
                <IoIosPeople size={22} />
                <p className="text-xs font-semibold">
                  {totalWithdrawals?.count}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </main>
);
};

export default AdminDash;
