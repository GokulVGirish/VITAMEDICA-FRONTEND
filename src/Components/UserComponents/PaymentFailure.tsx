import { useLocation, useNavigate } from "react-router-dom";

const PaymentFailure=()=>{
    const navigate=useNavigate()
    const location=useLocation()
    const reason=location.state.reason
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
                fill="#f44336"
                d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
              ></path>
              <path
                fill="#fff"
                d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"
              ></path>
              <path
                fill="#fff"
                d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"
              ></path>
            </svg>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Booking Failed
            </h2>
            <p className="text-gray-700 leading-tight mb-4">
              <h1 className="text-center font-bold mb-2"> Reason :{reason}</h1>
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
}
export default PaymentFailure