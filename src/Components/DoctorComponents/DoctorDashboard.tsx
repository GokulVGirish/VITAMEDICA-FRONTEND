import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend ,ArcElement,BarElement,defaults} from "chart.js";
import { Line,Doughnut } from "react-chartjs-2";
import { useEffect,useState } from "react";
import instance from "../../Axios/doctorInstance";
import { GiReceiveMoney } from "react-icons/gi";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,ArcElement,BarElement);


defaults.maintainAspectRatio=false
defaults.responsive = true;

const DoctorDash=()=> {

  const [selectedPage,setSelectedPage]=useState<string>("Todays")
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
      let response
     if(selectedPage==="Todays"){
        response = await instance.get(`/utility/dash/today`);
        
     }else if(selectedPage==="Weekly"){
      response=await instance.get(`/utility/dash/weekly`)
     }else if(selectedPage==="Monthly"){
      response=await instance.get(`/utility/dash/monthly`)
     }else{
      response=await instance.get(`/utility/dash/yearly`)
     }

      if(response?.data?.success){
        if(selectedPage==="Todays"){
        
          setTodaysRevenue(response?.data?.data.revenue);
          setAppointCountInfo(response?.data?.data.count)
        }else if(selectedPage==="Weekly"||selectedPage==="Monthly"){
         
            setChartDataString(response?.data.data.revenue)
             setAppointCountInfo(response?.data?.data.count);

        }else{
           
          setChartDataNumber(response?.data.data.revenue);
          setAppointCountInfo(response?.data?.data.count);

        }


     

      }
    
    } catch (error) {
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





return (
  <main className="flex min-h-screen flex-col items-center justify-center px-6 pt-20 pb-40 bg-gray-100">
    <select
      onChange={(e) => setSelectedPage(e.target.value)}
      className="bg-gray-50 border  border-gray-300 mt-10  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[150px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      <option value="Todays" selected>
        Todays
      </option>
      <option value="Weekly">Weekly</option>
      <option value="Monthly">Monthly</option>
      <option value="Yearly">Yearly</option>
    </select>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-[1200px] mt-10">
      {selectedPage === "Todays" && (
        <div className="flex flex-col items-center justify-center p-10 rounded-lg h-[400px] bg-white shadow-md">
          <h3 className="text-2xl text-gray-800 font-bold mb-6">
            {selectedPage} Revenue
          </h3>
          <div className="flex items-center justify-center h-full w-full">
            <GiReceiveMoney size={100} className="text-[#364f6bde] mr-4" />
            <div className="flex flex-col justify-center items-start">
              <h1 className="text-3xl border-l-4 border-[#56aac6] pl-2 font-extrabold text-[#364f6b] mb-2">
                {selectedPage} Revenue
              </h1>
              <p className="text-2xl border-2 px-4 rounded-lg border-[#364f6b] bg-slate-100 font-bold text-[#364f6b]">
                ₹{todaysRevenue || "0"}
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedPage !== "Todays" && (
        <div className="flex flex-col items-center justify-center p-10  rounded-lg h-[400px] bg-white shadow-md">
          <h3 className="text-2xl text-gray-800 font-bold mb-6">
            {selectedPage} Revenue
          </h3>
          <Line data={revenueChart} />
        </div>
      )}

      <div className="flex flex-col items-center justify-center p-10  rounded-lg h-[400px] bg-white shadow-md">
        <h3 className="text-2xl text-gray-800 font-bold mb-6">
          {selectedPage} Appointments & Cancellations
        </h3>
        <Doughnut data={countChart} />
      </div>
    </div>
  </main>
);
}


export default DoctorDash
