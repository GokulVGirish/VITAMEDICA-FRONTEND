
import { io,Socket } from "socket.io-client";
import { useEffect,createContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


export const SocketContext=createContext<Socket|null>(null)


const SocketProvider=({children}:{children:ReactNode})=>{

    const [socket,setSocket]=useState<Socket|null>(null)
    const navigate=useNavigate()
    useEffect(() => {
      
      const socketInstance = io("http://localhost:4000", {
        withCredentials: true,
      });

      setSocket(socketInstance);
      
      socketInstance.on("blocked", (role) => {
        Cookies.remove("accessToken")
        Cookies.remove("refreshToken")

        if (role === "doctor") {
          navigate("/doctor/login");
        } else {
          navigate("/login");
        }
      });

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


