import React, { useState, useEffect } from "react";
import { FaPhone, FaTimes } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SocketContext } from "../../socketio/SocketIo";
import instance from "../../Axios/axios";



const CallModal = ({ callData, onClose }:{callData:any,onClose:()=>void}) => {

    console.log("callldata",callData)

  const socket=useContext(SocketContext)
  const [doctor,setDoctor]=useState<{image:string;name:string,department:{name:string}}|null>(null)
  const navigate = useNavigate();
  console.log("doctor",doctor)


  const handleCancelCall = () => {
    const from = callData.from;
    socket?.emit("cut-call", { from });
  
    onClose();
  };

   useEffect(() => {
     const getDoctorDetail = async () => {
       const response = await instance.get(`/doctors/${callData.from}/profile`);
       if (response.data.success) {
         console.log("response is here", response.data);
         setDoctor(response.data.doctor)
       }
     };
     getDoctorDetail();
   }, []);

//   const handleCallRequest = async (e:any) => {
//     e.preventDefault();
//     try {
//       navigate("/doctor/videocall", { state: { callData } });
//     } catch (error) {
//       console.error("Error navigating to video call:", error);
//     }
//   };

  return (
    <div
      id="popup-modal"
      className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full max-h-full flex overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="p-4 md:p-5 text-center">
            <div className=" flex items-center justify-center">
              <img
                className="w-14 h-14 p-1 mb-2 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                src={
                  doctor?.image ||
                  "https://assets-us-01.kc-usercontent.com/00be6aeb-6ab1-00f0-f77a-4c8f38e69314/e1e48dfd-23bb-4675-998d-0b76ecd67076/noPicturePlayer.jpg"
                }
                alt="Bordered avatar"
              />
            </div>

            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {doctor?.name} is Calling...
            </h3>
            <h3 className="mb-5 text-md font-normal text-gray-500 dark:text-gray-400">
              {doctor?.department.name}
            </h3>
            <button
              type="button"
              className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              onClick={() =>
                navigate(
                  `/doctor/videocall/${callData.room}/${callData.to}/${callData.from}/${"user"}`,{state:{img:doctor?.image}}
                )
              }
            >
              Accept
            </button>
            <button
              type="button"
              className="text-white ml-3 bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              onClick={handleCancelCall}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
