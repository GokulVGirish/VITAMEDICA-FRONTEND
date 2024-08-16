
import { io,Socket } from "socket.io-client";
import { useEffect,createContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {toast} from "sonner"


export const SocketContext=createContext<Socket|null>(null)


const SocketProvider=({children}:{children:ReactNode})=>{

    const [socket,setSocket]=useState<Socket|null>(null)
    const navigate=useNavigate()
    const accessToken=Cookies.get("accessToken")
    useEffect(() => {
      
      const socketInstance = io("http://localhost:4000", {
        withCredentials: true,
        reconnection:true,
        secure:true,
        auth: {
          token: accessToken || null
        }
      });


      setSocket(socketInstance);
      
      socketInstance.on("blocked", (role) => {
        toast.error("User Blocked",{richColors:true,duration:1500,onAutoClose:()=>{
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");

            if (role === "doctor") {
              navigate("/doctor/login");
            } else {
              navigate("/login");
            }
        }})
      
      });
      socket?.on("disconnect",(reason)=>{
        socket.emit("clientDisconnected",accessToken||null);

      })

      return () => {
        socketInstance.disconnect();
      };
    }, []);


    return(

        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>




    )
 
}
   export default SocketProvider;


