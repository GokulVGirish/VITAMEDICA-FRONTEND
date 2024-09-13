import { useNavigate } from "react-router-dom";
import moment from "moment";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const unparsedAppointmentData = localStorage.getItem("appointmentData");
  const parsedData = JSON.parse(unparsedAppointmentData as string);
  return (
    <div className="flex flex-col justify-center items-center  bg-gray-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-lg mb-52 overflow-hidden max-w-lg w-full">
        <div className=" flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="12em"
            height="10em"
            viewBox="0 0 48 48"
          >
            <path
              fill="#c8e6c9"
              d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
            ></path>
            <path
              fill="#4caf50"
              d="M34.586,14.586l-13.57,13.586l-5.602-5.586l-2.828,2.828l8.434,8.414l16.395-16.414L34.586,14.586z"
            ></path>
          </svg>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Booking Sucessful
          </h2>
          <p className="text-gray-700 leading-tight mb-4">
            <h1 className="text-center font-bold mb-2">
              {" "}
              {moment(parsedData.date).format("MMMM D, YYYY")}
            </h1>
            <h2 className="text-center mb-4 font-bold">
              {" "}
              {moment(parsedData.start).format("h:mm A")}-{" "}
              {moment(parsedData.end).format("h:mm A")}
            </h2>
            <div className=" flex justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
              >
                Go Home
              </button>
            </div>
          </p>
        </div>
      </div>
    </div>
  );
};
export default PaymentSuccess;
