
import { io,Socket } from "socket.io-client";
import { useEffect,createContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {toast} from "sonner"
import { clearUser } from "../Redux/userSlice";
import { useAppDispatch } from "../Redux/hoocks";
import { clearDoctor } from "../Redux/doctorSlice";
const mainUrl = import.meta.env.VITE_MAIN_URL;


export const SocketContext=createContext<Socket|null>(null)


const SocketProvider=({children}:{children:ReactNode})=>{

    const [socket,setSocket]=useState<Socket|null>(null)
    const navigate=useNavigate()
    const accessToken=Cookies.get("accessToken")
    const dispatch=useAppDispatch()
    useEffect(() => {
      
      const socketInstance = io(mainUrl, {
        withCredentials: true,
        reconnection: true,
        secure: true,
        auth: {
          token: accessToken || null,
        },
      });

      


      setSocket(socketInstance);
      
      socketInstance.on("blocked", (role) => {
        toast.error("User Blocked",{richColors:true,duration:1500,onAutoClose:()=>{
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");

            if (role === "doctor") {
              dispatch(clearDoctor())
              navigate("/doctor/login");
            } else {
              dispatch(clearUser())
              navigate("/login");
            }
        }})
      
      });
   

      return () => {
        setSocket(null); 
        socketInstance.disconnect();
      };
    }, [accessToken,dispatch,navigate]);


    return(

        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>




    )
 
}
//g
   export default SocketProvider;


