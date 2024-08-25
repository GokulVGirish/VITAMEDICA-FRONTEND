import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend ,ArcElement,BarElement,defaults} from "chart.js";
import { Line,Doughnut } from "react-chartjs-2";
import { useEffect,useState } from "react";
import instance from "../../Axios/doctorInstance";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend,ArcElement,BarElement);


interface YearlyRevenue {
  _id: number;
  totalRevenue: number;
}
interface MonthlyRevenue {
  month: string; 
  totalRevenue: number;
}

defaults.maintainAspectRatio=false
defaults.responsive = true;

const DoctorDash=()=> {
  const [yearlyRevenueData, setYearlyRevenueData] = useState<YearlyRevenue[]>([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<MonthlyRevenue[]>([]);
  const [weeklyAppointmentInfo, setWeelyAppointmentInfo] = useState<{
    appointmentsCount: number;
    cancellationsCount: number;
  }>();
  const [monthlyAppointmentInfo, setMonthlyAppointmentInfo] = useState<{
    appointmentsCount: number;
    cancellationsCount: number;
  }>();


useEffect(() => {
  const fetchYearlyRevenue = async () => {
    try {
      const response = await instance.get(`/utility/dash/data`);
      if(response.data.success){

          setYearlyRevenueData(response.data.dataYearly);
          setMonthlyRevenueData(response.data.dataMonthly)
          setWeelyAppointmentInfo(response.data.weeklyCount);
          setMonthlyAppointmentInfo(response.data.monthlyCount);

      }
    
    } catch (error) {
      console.error("Error fetching yearly revenue:", error);
    }
  };

  fetchYearlyRevenue();
}, []);

const chartDataYearly = {
  labels: yearlyRevenueData?.map((item) => item._id.toString()), // X-axis labels (years)
  datasets: [
    {
      label: "Yearly Revenue",
      data: yearlyRevenueData?.map((item) => item.totalRevenue),
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
  const chartDataMonthly = {
    labels: monthlyRevenueData?.map((item) => item.month),
    datasets: [
      {
        label: "Monthly Revenue",
        data: monthlyRevenueData?.map((item) => item.totalRevenue),
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
    const weeklyAppointment = {
      labels: ["Appointments", "Cancellations"], // Labels for each segment
      datasets: [
        {
          label: "Count",
          data: [weeklyAppointmentInfo?.appointmentsCount, weeklyAppointmentInfo?.cancellationsCount], // Data corresponding to each label (appointments and cancellations)
          borderColor: ["rgba(54, 79, 107, 1)"],
          backgroundColor: [
            "rgba(68, 181, 215, 0.8)", // Background color for "Appointments"
            "rgba(255, 99, 132, 0.8)", // Background color for "Cancellations" (red)
          ],
          borderRadius: 5,
        },
      ],
    };
    const monthlyAppointment = {
      labels: ["Appointments", "Cancellations"], // Labels for each segment
      datasets: [
        {
          label: "Count",
          data: [monthlyAppointmentInfo?.appointmentsCount, monthlyAppointmentInfo?.cancellationsCount], // Data corresponding to each label (appointments and cancellations)
          borderColor: ["rgba(54, 79, 107, 1)"],
          backgroundColor: [
            "rgba(68, 181, 215, 0.8)", // Background color for "Appointments"
            "rgba(255, 99, 132, 0.8)", // Background color for "Cancellations" (red)
          ],
          borderRadius: 5,
        },
      ],
    };
  console.log("data",yearlyRevenueData,monthlyRevenueData,weeklyAppointmentInfo,monthlyAppointmentInfo)


  return (
    <main className="flex min-h-screen flex-col items-center mt-5 justify-center px-4 md:px-8 xl:px-10 py-44">
     
      <div className="grid md:grid-cols-4 md:grid-rows-2   w-full gap-10 max-w-[1400px] mb-10">
        <div className="flex flex-col col-start-1 col-end-3  items-center justify-center p-4   rounded-xl h-[400px]">
          <h3 className="text-2xl  text-Black mt-6 font-bold mb-4">
            Monthly Revenue
          </h3>
          <Line data={chartDataMonthly} />
        </div>
        <div className="flex flex-col col-start-3 col-end-5  items-center justify-center p-4   rounded-xl h-[400px]">
          <h3 className="text-2xl  text-Black mt-6 font-bold mb-4">
            Yearly Revenue
          </h3>
          <Line data={chartDataYearly} />
        </div>

        <div className="flex flex-col col-start-1 col-end-3 row-start-2 row-end-3 items-center justify-center p-4  rounded-xl h-[400px]">
          <h3 className="text-2xl  text-Black mt-6 font-bold ">
            Weekly Appointments & Cancellations
          </h3>
          <Doughnut
            data={weeklyAppointment}
          />
        </div>

        <div className="flex flex-col col-start-3 col-end-5 items-center justify-center p-4  rounded-xl h-[400px]">
          <h3 className="text-2xl  text-Black mt-6 font-bold ">
            Monthly Appointments & Cancellations
          </h3>
          <Doughnut
            data={monthlyAppointment}
          />
        </div>
      </div>
    </main>
  );
}


export default DoctorDash
