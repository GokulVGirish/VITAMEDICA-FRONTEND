import { useCallback, useEffect, useState ,useContext} from "react";
import { useParams,useNavigate } from "react-router-dom";
import instance from "../../Axios/doctorInstance";
import moment from "moment";
import PdfViewer from "../extra/PdfViewer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {toast} from "sonner"

import { SocketContext } from "../../socketio/SocketIo";
import { faFilePdf, faPaperPlane } from "@fortawesome/free-solid-svg-icons";


const DoctorUserProfile=()=>{

    const [appointmentDetails,setAppointmentDetails]=useState<any>(null)
    const socket=useContext(SocketContext)
    const [online,setOnline]=useState<boolean>(false)
    const [pdfModal,setPdfModal]=useState(false)
    console.log("appointments",appointmentDetails)
    const navigate=useNavigate()
    const {id}=useParams()
    const [messages,setMessages]=useState<any>()
    const callerId=34433
   


    const fetchAppointmentData=useCallback(async()=>{

        const response=await instance.get(`/appointments/${id}`)
        if(response.data.success){
            setAppointmentDetails(response.data.detail)

        }
       


    },[id])

    useEffect(()=>{
        fetchAppointmentData()

    },[fetchAppointmentData])

    useEffect(()=>{
      const intervalId = setInterval(() => {
        if (appointmentDetails) {
          socket?.emit("check-online-status", {
            from: appointmentDetails?.docId,
            user: appointmentDetails?.userId,
          });
        }
      }, 5000); 

      return ()=>{
        clearInterval(intervalId)
      }

    },[appointmentDetails,socket])
   
    console.log("onelee",online)
    function calculateAge(dob: Date): number {
      const today = new Date();
      const birthDate = new Date(dob);

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    }

    useEffect(() => {
      const handleOnlineStatus = (data: { status: boolean }) => {
        setOnline(data.status);
      };

      socket?.on("check-online-status", handleOnlineStatus);

      return () => {
        socket?.off("check-online-status", handleOnlineStatus);
      };
    }, [socket]);
    



    return (
      <div className="px-16 py-3 ">
        <div className="p-8 bg-white shadow mt-24 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0"></div>
            <div className="relative">
              <div className="w-48  h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                <img
                  className=" rounded-full"
                  src={
                    appointmentDetails?.image ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  alt="no img"
                />

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span
                  className={`absolute  top-36 right-3 w-6 h-6 ${
                    online ? "bg-green-500" : "bg-red-500"
                  }  border-2 border-white rounded-full`}
                ></span>
              </div>
            </div>

            <div className="space-x-8 flex  justify-between mt-32 md:mt-0 md:justify-center">
              {appointmentDetails?.status === "cancelled" ? (
                <span className="text-white py-2 px-4 uppercase cursor-default rounded bg-red-400  shadow  font-medium transition transform ">
                  cancelled
                </span>
              ) : appointmentDetails?.status === "completed" ? (
                <span className="text-white py-2 px-4 uppercase cursor-default rounded bg-green-400  shadow  font-medium transition transform ">
                  completed
                </span>
              ) : (
                <button
                  className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                  onClick={() => {
                    //   const appointmentDate=new Date(appointmentDetails?.date)
                    //   const today=new Date()
                    //  if (
                    //    appointmentDate.getFullYear() !== today.getFullYear() ||
                    //    appointmentDate.getMonth() !== today.getMonth() ||
                    //    appointmentDate.getDate() !== today.getDate()
                    //  ) {
                    //    return toast.error("Not the appointment date", {
                    //      richColors: true,
                    //      duration: 1500,
                    //    });
                    //  }
                    navigate(
                      `/doctor/videocall/${id}/${appointmentDetails.docId}/${
                        appointmentDetails?.userId
                      }/${"doctor"}`,
                      { state: { img: appointmentDetails?.image } }
                    );
                  }}
                >
                  Start Consultation
                </button>
              )}
              {appointmentDetails?.status === "completed" && (
                <span className="" onClick={() => setPdfModal(true)}>
                  <FontAwesomeIcon
                    className="size-9 hover:text-gray-400"
                    icon={faFilePdf}
                  />
                </span>
              )}
            </div>
          </div>

          <div className="mt-20 text-center border-b pb-12">
            <h1 className="text-4xl font-medium text-gray-700">
              {appointmentDetails?.userName.toUpperCase()},{" "}
              <span className="font-light text-gray-500">
                {appointmentDetails?.dob
                  ? calculateAge(appointmentDetails?.dob)
                  : ""}
              </span>
            </h1>
            <p className="font-light text-gray-600 mt-3">
              {appointmentDetails?.city}, {appointmentDetails?.state}
            </p>
            <p className="mt-3 text-gray-500">
              Blood Group - {appointmentDetails?.bloodGroup}
            </p>
            <p className="mt-2 text-gray-500">
              Appointment date :{" "}
              {moment(appointmentDetails?.date).format("MMMM D, YYYY")}{" "}
            </p>
            <p className="mt-2 text-gray-500">
              Appointment time :{" "}
              {moment(appointmentDetails?.start).format("h:mm A")}-{" "}
              {moment(appointmentDetails?.end).format("h:mm A")}
            </p>
            <div className="flex flex-col items-center">
              {appointmentDetails?.status === "completed" &&
                appointmentDetails?.review && (
                  <div className="mt-4 text-center">
                    <span className="block text-lg font-medium text-gray-700">
                      User Rating:
                    </span>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      {Array.from({
                        length: appointmentDetails?.review.rating,
                      })?.map((_, index) => (
                        <svg
                          key={index}
                          className="text-yellow-500 w-5 h-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    {appointmentDetails?.review.description && (
                      <span className="mt-2 block text-gray-600">
                        {appointmentDetails?.review?.description || ""}
                      </span>
                    )}
                  </div>
                )}
            </div>
          </div>
          {appointmentDetails?.status === "completed" && (
            <>
              {/* message */}
              <div className="flex flex-col mt-5 md:mt-0   flex-shrink-0 rounded-2xl bg-[#081f36] h-[280px] md:h-[500px] w-full p-4">
                <div className="flex flex-col h-full overflow-x-auto mb-4">
                  <div className="flex flex-col h-full">
                    <div className="grid grid-cols-12 gap-y-2">
                      {messages?.map((msg: any, index: any) => {
                        return msg.sender !== callerId ? (
                          <div
                            key={index}
                            className="col-start-1 col-end-8 p-3 rounded-lg"
                          >
                            <div className="flex flex-row items-center">
                              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                <img
                                  className="rounded-full"
                                  src={
                                    "https://photosbull.com/wp-content/uploads/2024/05/no-dp_16.webp"
                                  }
                                  alt="noimg"
                                />
                              </div>
                              <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                <div>{msg.message}</div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={index}
                            className="col-start-6 col-end-13 p-3 rounded-lg"
                          >
                            <div className="flex items-center justify-start flex-row-reverse">
                              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                Me
                              </div>
                              <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                <div>{msg.message}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center h-16 rounded-xl bg-[#3a5e81] w-full px-4">
                  <div></div>
                  <div className="flex-grow ml-4">
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex w-full border rounded-xl  focus:outline-none focus:border-indigo-300 pl-4 h-10"
                      />
                      <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* message */}
            </>
          )}

          <div className="mt-12 flex flex-col justify-center">
            <p className="text-gray-600 text-3xl text-center font-bold lg:px-16">
              Medical Records
            </p>
            <button className="text-indigo-500 py-2 px-4 font-medium mt-4">
              Show records
            </button>
          </div>
        </div>
        {pdfModal && (
          <PdfViewer
            viewPdf={appointmentDetails?.prescription}
            closeModal={() => setPdfModal(false)}
          />
        )}
      </div>
    );
}
export default DoctorUserProfile