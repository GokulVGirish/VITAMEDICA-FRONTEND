import logo from '@/assets/logo4.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faBookMedical, faChartPie, faWallet } from '@fortawesome/free-solid-svg-icons';
import { faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { faPersonHalfDress } from '@fortawesome/free-solid-svg-icons/faPersonHalfDress';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate,useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAppDispatch } from '../../Redux/hoocks';
import { clearDoctor } from '../../Redux/doctorSlice';
import { useState } from 'react';



const DoctorSidebar=()=>{
    const navigate=useNavigate()
    const location=useLocation()
    const dispatch=useAppDispatch()
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    function handleLogout(){
        Cookies.remove("accessToken")
        Cookies.remove("refreshToken")
        navigate("/doctor/login")
        dispatch(clearDoctor())

    }
     const isActive = (path:string) => {
      console.log("pathname",location.pathname)
      const splittedPathname=location.pathname.split("/").slice(0,3).join("/")
      console.log("splittedPathname",path,splittedPathname)
      return path==splittedPathname
     }
  
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);


return (
  <>
    <button
      onClick={toggleSidebar}
      className="lg:hidden fixed top-4  right-4 z-50 p-4 bg-[#56aac6] text-white rounded-full shadow-lg"
    >
      <span>☰</span>
    </button>

    <div
      className={`fixed inset-0 top-0 left-0 lg:static lg:w-64 bg-[#56aac6] shadow-md transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
      style={{ zIndex: 1000 }}
    >
      <div className="flex relative items-center justify-center h-16 bg-[#56aac6]">
        <img src={logo} alt="logo" className="w-44 rounded-lg shadow-xl" />
        <span
          onClick={toggleSidebar}
          className="text-white absolute lg:hidden top-5 right-5"
        >
          x
        </span>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 bg-[#56aac6]">
          <span
            onClick={() => navigate("/doctor")}
            className={`flex cursor-pointer hover:rounded-md hover:text-white items-center px-4 py-2 gap-5 ${
              isActive("/doctor")
                ? `text-white bg-gray-700 rounded-md`
                : `text-[#364f6b]`
            } hover:font-bold`}
          >
            <FontAwesomeIcon icon={faChartPie} />
            Dashboard
          </span>
          <span
            onClick={() => navigate("/doctor/addSlot")}
            className={`flex cursor-pointer hover:rounded-md hover:text-white items-center px-4 py-2 gap-5 ${
              isActive("/doctor/addSlot")
                ? `text-white bg-gray-700 rounded-md`
                : `text-[#364f6b]`
            } hover:font-bold`}
          >
            <FontAwesomeIcon icon={faPersonHalfDress} />
            Slots
          </span>
          <span
            onClick={() => navigate("/doctor/appointment")}
            className={`flex cursor-pointer hover:rounded-md hover:text-white items-center px-4 py-2 gap-5 ${
              isActive("/doctor/appointment") || isActive("/doctor/userProfile")
                ? `text-white bg-gray-700 rounded-md`
                : `text-[#364f6b]`
            } hover:font-bold`}
          >
            <FontAwesomeIcon icon={faBookMedical} />
            Appointments
          </span>
          <span
            onClick={() => navigate("/doctor/profile")}
            className={`flex cursor-pointer hover:rounded-md hover:text-white items-center px-4 py-2 gap-5 ${
              isActive("/doctor/profile")
                ? `text-white bg-gray-700 rounded-md`
                : `text-[#364f6b]`
            } hover:font-bold`}
          >
            <FontAwesomeIcon icon={faUserDoctor} />
            Doctor Profile
          </span>
          <span
            onClick={() => navigate("/doctor/wallet")}
            className={`flex cursor-pointer hover:rounded-md hover:text-white items-center px-4 py-2 gap-5 ${
              isActive("/doctor/wallet")
                ? `text-white bg-gray-700 rounded-md`
                : `text-[#364f6b]`
            } hover:font-bold`}
          >
            <FontAwesomeIcon icon={faWallet} />
            Wallet
          </span>
          <span
            onClick={handleLogout}
            className="flex cursor-pointer items-center hover:text-white px-4 py-2 gap-5 text-[#364f6b] hover:rounded-md hover:font-bold"
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            Logout
          </span>
        </nav>
      </div>
    </div>

    {isSidebarOpen && (
      <div
        className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
        onClick={toggleSidebar}
      />
    )}
  </>
);
}
export default DoctorSidebar