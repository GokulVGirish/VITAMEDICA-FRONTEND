import { useEffect, useMemo, useState } from "react";
import instance from "../../Axios/doctorInstance";
import moment from "moment";
import Swal from "sweetalert2";
import {toast} from "sonner"
import { useNavigate } from "react-router-dom";
import BookingCancellationReason from "../extra/CancellationReason";
const DoctorAppointments=()=>{

    const [appointments,setAppointments]=useState<any>(null)
    const [filter,setFilter]=useState<"today"|"upcomming">("today")
    const [page,setPage]=useState(1)
    const [cancellationReason,setCancellationReason]=useState("")
    const [cancellationReasonModel,setCancellationReasonModal]=useState(false)
    const [cancellationDate,setCancellationDate]=useState<Date>()
    const [cancellationTime,setCancellationTime]=useState<Date>()
    const [totalPages,setTotalPages]=useState(1)
    const navigate=useNavigate()
    const limit:number=7
    
    console.log("appointments",appointments)


    useEffect(()=>{

        if(filter==="today"){

            const getTodaysApointments=async()=>{
                const response = await instance.get("/appointments/today");
                if(response.data.success){
                    setAppointments(response.data.appointments)
                }

            }
            getTodaysApointments()

        }else{
            const getUpcommingAppointments=async()=>{
                const response = await instance.get(
                  `/appointments/upcomming?page=${page}&limit=${limit}`
                );
                console.log("upcomming res",response.data)
                if(response.data.success){
                  setAppointments(response.data.appointments)
                  setTotalPages(response.data.totalPages);    
                }

            }
            getUpcommingAppointments()
        }

    },[filter,page])
    const handlePrevPage=()=>{
        if(page>1){
            setPage((prevState)=>prevState-1)
        }
    }
    const handleNextPage=()=>{
        setPage((prevState)=>prevState+1)
    }
  const handleBookingCancellation=(date:Date,start:Date)=>{
   
      Swal.fire({
        title:
          "This slot has been booked and money will be debited from Your wallet?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, proceed!",
        cancelButtonText: "No, cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setCancellationReasonModal(true)
          setCancellationDate(date)
          setCancellationTime(start)
        
        }
      });

  }
  const handleCancel=async()=>{
    console.log("clicked")
    if(cancellationReason.trim()===""){
      return toast.error("Enter a valid reason", {
        richColors: true,
        duration: 1500,
      });
    }
      const response = await instance.delete(
        `/slots/booked?date=${cancellationDate}&startTime=${cancellationTime}`,{data:{reason:cancellationReason}}
      );
      if (response.data.success) {
        setCancellationReason("")
        setCancellationReasonModal(false)
        toast.success(response.data.message, {
          richColors: true,
          duration: 1500,
        });
        setAppointments((prevState: any[]) =>
          prevState.map((appointment) =>
            appointment.start === cancellationTime
              ? { ...appointment, status: "cancelled" }
              : appointment
          )
        );
      }

  }

   const appointmentRows = useMemo(
     () =>
       appointments?.map((appointment: any) => (
         <tr
           key={appointment._id}
           className="hover:bg-gray-100 transition-all cursor-pointer"
         >
           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
             {moment(appointment?.date).format("MMMM D, YYYY")}
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
             {moment(appointment?.start).format("h:mm A")}-{" "}
             {moment(appointment?.end).format("h:mm A")}
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
             {appointment?.userName}
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
             <span
               className={`py-1 px-2.5 border-none rounded text-base font-medium w-24 text-center ${
                 appointment?.status === "completed"
                   ? "text-green-800 bg-green-100"
                   : appointment?.status === "pending"
                   ? "text-yellow-800 bg-yellow-100"
                   : "text-red-800 bg-red-100"
               }`}
             >
               {appointment?.status}
             </span>
           </td>
           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
             {appointment?.status === "pending" ? (
               <button
                 onClick={() =>
                   handleBookingCancellation(
                     appointment?.date,
                     appointment?.start
                   )
                 }
                 className="mr-2 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded-full w-24 text-center"
               >
                 Cancel
               </button>
             ) : (
               <button
                 className={`mr-2 py-1 px-3 rounded-full w-24 text-center ${
                   appointment?.status === "completed"
                     ? "bg-green-500 hover:bg-green-700"
                     : "bg-red-500 hover:bg-red-700"
                 } text-white`}
               >
                 {appointment?.status === "cancelled"
                   ? "Cancelled"
                   : "Completed"}
               </button>
             )}
           </td>
           <td>
             <button
               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded w-20 text-center"
               onClick={() =>
                 navigate(`/doctor/userProfile/${appointment._id}`)
               }
             >
               View
             </button>
           </td>
         </tr>
       )),
     [appointments]
   );



    return (
      <>
        <div className="mb-7">
          <div className=" flex justify-center items-center">
            <div className="w-full max-w-4xl">
              <div className="text-center my-4">
                <h1 className="text-2xl font-bold">Appointments</h1>{" "}
              </div>

              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <button
                    onClick={() => setFilter("today")}
                    className={`px-4 py-2 mr-2 rounded-lg transition-all ${
                      filter === "today"
                        ? "bg-[#56aac6] text-white"
                        : "bg-gray-300 text-gray-700"
                    } hover:bg-[#4993ac]`}
                  >
                    Todays's
                  </button>
                  <button
                    onClick={() => setFilter("upcomming")}
                    className={`px-4 py-2 mr-2 rounded-lg transition-all ${
                      filter === "upcomming"
                        ? "bg-[#56aac6] text-white"
                        : "bg-gray-300 text-gray-700"
                    } hover:bg-[#4993ac]`}
                  >
                    Upcomming
                  </button>
                </div>
              </div>

              <div>
                <br />
              </div>

              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-[#56aac6] text-white">
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                      actions
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                      view
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointmentRows}
                </tbody>
              </table>
              {cancellationReasonModel && (
                <BookingCancellationReason
                  handleCancel={handleCancel}
                  cancellationReason={cancellationReason}
                  setCancellationReasonModal={setCancellationReasonModal}
                  setCancellationReason={setCancellationReason}
                />
              )}
              {appointments?.length === 0 && (
                <div className=" flex  min-w-full h-10 font-bold shadow-lg text-white px-5 items-center justify-center  bg-gray-700 rounded-lg ">
                  No Appointments
                </div>
              )}
            </div>
          </div>
        </div>
        {filter === "upcomming" && (
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
        )}
      </>
    );
}
export default DoctorAppointments