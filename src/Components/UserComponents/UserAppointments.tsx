
import { useState,useEffect } from "react";
import instance from "../../Axios/axios";
import moment from "moment";
import {toast} from "sonner"
import { AxiosError } from "axios";
import Swal from "sweetalert2";
const UserAppointments=()=>{
    const [appointments,setAppointments]=useState<any>(null)
    const [page,setPage]=useState(1)
    const [totalPages,setTotalPages]=useState(1)
    const limit:number=10
    console.log("appoint",appointments)
    console.log("totalPages",totalPages)


    useEffect(()=>{
        const getAppointments=async()=>{
            const response=await instance.get(`/appointments?page=${page}&limit=${limit}`)
            if(response.data.success){
                console.log("response",response.data)
                setAppointments(response.data.appointments)
                setTotalPages(response.data.totalPage);
            }



        }
        getAppointments()


    },[page])
    const handlePrevPage=()=>{
        if(page>1){
            setPage((prevState)=>prevState-1)
        }
    }
    const handleNextPage=()=>{
        setPage((prevState)=>prevState+1)
    }
    const cancelAppointment=async(appointmentId:string,date:Date,startTime:Date)=>{

    try{
       Swal.fire({
         title: "Sure you want to cancel?",
         text: "Cancellation will only return 60% of the booked amount",
         icon: "warning",
         showCancelButton: true,
         confirmButtonText: "Yes, proceed!",
         cancelButtonText: "No, cancel",
       }).then(async (result) => {
         if (result.isConfirmed) {
           const response =
             await instance.put(`/appointments/${appointmentId}/cancel?date=${date}&startTime=${startTime}
      `);
           if (response.data.success) {
             toast.success(response.data.message, {
               richColors: true,
               duration: 1500,
             });
             setAppointments((prevState: any) =>
               prevState?.map((appointment: any) =>
                 appointment._id == appointmentId
                   ? { ...appointment, status: "cancelled" }
                   : appointment
               )
             );
           }
         }
       });
       
    }
    catch(error){
      if(error instanceof AxiosError){
          toast.error(error.response?.data.message, {
            richColors: true,
            duration: 1500,
          });

      }
    }
    }

    return (
      <>
        <div className=" mb-7">
          <div className=" flex justify-center items-center">
            <div className="w-full max-w-4xl">
              <div className="text-center my-4">
                <h1 className="text-2xl font-bold">Appointments</h1>{" "}
              </div>

              <div>
                <br />
              </div>

              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
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
                      Status
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                      actions
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
                          {appointment?.doctorName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            className={`py-1 px-2.5  border-none rounded   text-base  font-medium ${
                              appointment?.status === "completed"
                                ? "text-green-800 bg-green-100 "
                                : "text-red-800 bg-red-100 "
                            }   rounded-md`}
                          >
                            {appointment?.status}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {appointment?.status === "pending" ? (
                            <button
                              onClick={() =>
                                cancelAppointment(
                                  appointment._id,
                                  appointment?.date,
                                  appointment?.start
                                )
                              }
                              className={`mr-2 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded-full`}
                            >
                              cancel
                            </button>
                          ) : (
                            <button
                              className={`mr-2 ${
                                appointment?.status === "completed"
                                  ? "bg-green-500 hover:bg-green-700"
                                  : "bg-red-500 hover:bg-red-700"
                              } text-white py-1 px-3 rounded-full`}
                            >
                              {appointment?.status === "cancelled"
                                ? "cancelled"
                                : "completed"}
                            </button>
                          )}
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
              {page} / {totalPages}
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
export default UserAppointments