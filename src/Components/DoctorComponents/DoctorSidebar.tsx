import logo from '@/assets/logo3.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookMedical, faChartPie, faWallet } from '@fortawesome/free-solid-svg-icons';
import { faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { faPersonHalfDress } from '@fortawesome/free-solid-svg-icons/faPersonHalfDress';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate,useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';



const DoctorSidebar=()=>{
    const navigate=useNavigate()
    const location=useLocation()
    function handleLogout(){
        Cookies.remove("accessToken")
        Cookies.remove("refreshToken")
        navigate("/doctor/login")

    }
     const isActive = (path:string) => location.pathname === path;



    return (
      <div className="hidden md:flex flex-col w-64 bg-[#05acb4]">
        <div className="flex items-center justify-center h-16 bg-[#05acb4]">
          <span className="text-white font-bold uppercase">
            <img src={logo} alt="logo" className=" w-44 rounded-lg shadow-xl" />
          </span>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 bg-[#05acb4]">
            <span
              onClick={() => navigate("/doctor")}
              className={`flex cursor-pointer   hover:rounded-md hover:text-white items-center px-4 py-2 gap-5  ${
                isActive("/doctor")
                  ? `text-white  bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold `}
            >
              <FontAwesomeIcon icon={faChartPie} />
              Dashboard
            </span>
            <span
              onClick={() => navigate("/doctor/addSlot")}
              className={`flex cursor-pointer   hover:rounded-md hover:text-white items-center px-4 py-2 gap-5  ${
                isActive("/doctor/addSlot")
                  ? `text-white  bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold   `}
            >
              <FontAwesomeIcon icon={faPersonHalfDress} />
              Slots
            </span>
            <span
              onClick={() => navigate("/doctor/appointment")}
              className={`flex cursor-pointer   hover:rounded-md hover:text-white items-center px-4 py-2 gap-5  ${
                isActive("/doctor/appointment")
                  ? `text-white  bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold   `}
            >
              <FontAwesomeIcon icon={faBookMedical} />
              Appointments
            </span>
            <span
              onClick={() => navigate("/doctor/profile")}
              className={`flex cursor-pointer   hover:rounded-md hover:text-white items-center px-4 py-2 gap-5  ${
                isActive("/doctor/profile")
                  ? `text-white  bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold   `}
            >
              <FontAwesomeIcon icon={faUserDoctor} />
              Doctor Profile
            </span>

            <span
              onClick={() => navigate("/doctor/wallet")}
              className={`flex cursor-pointer   hover:rounded-md hover:text-white items-center px-4 py-2 gap-5  ${
                isActive("/doctor/wallet")
                  ? `text-white  bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold  `}
            >
              <FontAwesomeIcon icon={faWallet} />
              Wallet
            </span>

            <span
              onClick={handleLogout}
              className="flex cursor-pointer items-center hover:text-white px-4 py-2  gap-5 text-[#364f6b]  hover:rounded-md hover:font-bold "
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              Logout
            </span>
          </nav>
        </div>
      </div>
    );
}
export default DoctorSidebar