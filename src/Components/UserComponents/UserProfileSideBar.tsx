import logo from '@/assets/logo2.png';
import { useNavigate,useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faHouseMedical, faUser } from "@fortawesome/free-solid-svg-icons";
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { useContext } from 'react';
import { SocketContext } from '../../socketio/SocketIo';


const UserProfileSideBar=()=>{
    const navigate=useNavigate()
    const location=useLocation()
    const socket=useContext(SocketContext)
      function handleLogout() {
        socket?.emit("logout");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        navigate("/login");
      }
       const isActive = (path: string) =>{ 
         const pathnameSplitted=location.pathname.split("/")
         const newPath1=pathnameSplitted.slice(0,3)
         return newPath1.join("/")===path
        }


    return (
      <div className="hidden md:flex flex-col w-64 bg-[#928EDE]">
        <div className="flex items-center justify-center h-16 bg-[#928EDE]">
          <span className="text-white font-bold uppercase">
            <img
              onClick={() => navigate("/")}
              src={logo}
              alt="logo"
              className=" w-44 rounded-lg shadow-xl"
            />
          </span>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 bg-[#928EDE]">
            <span
              onClick={() => navigate("/profile")}
              className={`flex cursor-pointer   hover:rounded-md hover:text-white items-center px-4 py-2 gap-5  ${
                isActive("/profile")
                  ? `text-white  bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold `}
            >
         <FontAwesomeIcon icon={faUser}/>
              Profile
            </span>
            <span
              onClick={() => navigate("/profile/appointment")}
              className={`flex cursor-pointer   hover:rounded-md hover:text-white items-center px-4 py-2 gap-5  ${
                isActive("/profile/appointment")||isActive("/profile/appointmentDetail")
                  ? `text-white  bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold `}
            >
          <FontAwesomeIcon icon={faHouseMedical}/>
              Appointments
            </span>
            <span
              onClick={() => navigate("/profile/wallet")}
              className={`flex cursor-pointer   hover:rounded-md hover:text-white items-center px-4 py-2 gap-5  ${
                isActive("/profile/wallet") 
                  ? `text-white  bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold `}
            >
              <FontAwesomeIcon icon={faWallet} />
              Wallet
            </span>
            <span
              onClick={handleLogout}
              className={`flex cursor-pointer   hover:rounded-md hover:text-white items-center px-4 py-2 gap-5 text-[#364f6b]  rounded-md hover:font-bold `}>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              Logout
            </span>
          </nav>
        </div>
      </div>
    );
}
export default UserProfileSideBar