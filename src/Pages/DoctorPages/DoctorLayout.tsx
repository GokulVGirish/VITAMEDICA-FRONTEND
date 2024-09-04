import { Outlet } from "react-router-dom";
import DoctorSidebar from "../../Components/DoctorComponents/Sidebar";
import useVerifyToken from "../../hooks and functions/verifyToken";
import { SocketContext } from "../../socketio/SocketIo";
import { useContext } from "react";
import { useAppDispatch } from "../../Redux/hoocks";
import { verifyDoctor } from "../../Redux/doctorSlice";
import {toast } from "sonner"

const DoctorLayoutPage = () => {
  const socket=useContext(SocketContext)
  const dispath=useAppDispatch()
  socket?.on("doctorVerified",()=>{
    console.log("vannu here")
    toast.success("Doctor Is Verified",{richColors:true,duration:1500,onAutoClose:()=>{
      dispath(verifyDoctor({ status: "Verified" }));
      

    }})
    

  });
   
  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <DoctorSidebar />
        <div className="flex flex-col flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default DoctorLayoutPage;
