import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminInstance from "../../Axios/adminInstance";

interface Appointment {
  data: [
    {
      _id: string;
      date: Date;
      start: Date;
      end: Date;
      amount: string;
      status:1;
      docName: string;
      department: string;
      userName: string;
    }
  ],
  totalCount:number

}
const AdminAppointmentListing=()=>{
       const [appointments, setAppointments] = useState<Appointment[]>([]);
       const [page, setPage] = useState(1);
       const [totalPages,setTotalPages]=useState(0)
       const navigate=useNavigate()

       const fetchAppointments=useCallback(async()=>{
        try{
            const response=await adminInstance.get(`/appointments?page=${page}&limit=10`)
            if(response.data.success){
                setAppointments(response.data.data[0].data)
                setTotalPages(response.data.data[0].totalCount);
            }

        }
        catch(error){

        }

       },[page])
       console.log("appointments",appointments)

       useEffect(()=>{
        fetchAppointments()

       },[fetchAppointments])

        const handlePrevPage = () => {
          if (page > 1) {
            setPage((prevState) => prevState - 1);
          }
        };
        const handleNextPage = () => {
          if (page < Math.ceil(totalPages / 10)) {
            setPage((prevState) => prevState + 1);
          }
        };
    return (
      <>
        <div className=" mb-7 ">
          <div className=" flex  justify-center items-center">
            <div className="w-full max-w-4xl">
              <div className="text-center my-4">
                <h1 className="text-2xl font-bold">Appointments</h1>{" "}
              </div>

              <div>
                <br />
              </div>

              <table className="min-w-ful bg-white rounded-lg overflow-hidden shadow-lg ">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3  border-b-2 border-gray-300  text-xs font-semibold uppercase tracking-wider">
                      view
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments &&
                    appointments.map((appointment: any) => (
                      <tr
                        key={appointment._id}
                        className="hover:bg-gray-100 transition-all"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {moment(appointment?.date).format("MMMM D, YYYY")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {moment(appointment?.start).format("h:mm A")}-{" "}
                          {moment(appointment?.end).format("h:mm A")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {appointment?.docName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {appointment?.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className={`py-1 px-2.5 border-none rounded text-base font-medium w-24 text-center ${
                              appointment?.status === "completed"
                                ? "text-green-800 bg-green-100"
                                : appointment?.status === "pending"
                                ? "text-yellow-800 bg-yellow-100"
                                : "text-red-800 bg-red-100"
                            }`}
                          >
                            {appointment?.status}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {
                                appointment?.amount
                            }
                          
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/appointments/${appointment._id}`
                              )
                            }
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded w-20 text-center"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {appointments?.length === 0 && (
                <div className=" flex  min-w-full h-10 font-bold shadow-lg text-white px-5 items-center justify-center  bg-gray-800 rounded-lg ">
                  No Appointments Yet
                </div>
              )}
            </div>
          </div>
        </div>
        <div className=" flex justify-center  mb-10 ">
          <div className="flex justify-between items-center  gap-10">
            <button
              disabled={page === 1}
              onClick={handlePrevPage}
              className="inline-flex items-center border border-indigo-300 px-3 py-1.5 rounded-md text-indigo-500 hover:bg-indigo-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              <span className="ml-1 font-bold text-lg">Back</span>
            </button>
            <h1 className=" text-indigo-500 font-bold">
              {page} / {Math.ceil(totalPages/10)}
            </h1>

            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="inline-flex items-center border border-indigo-300 px-3 py-1.5 rounded-md text-indigo-500 hover:bg-indigo-50"
            >
              <span className="mr-1 font-bold text-lg">Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </>
    );
}
export default AdminAppointmentListing