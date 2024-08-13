import logo from '@/assets/logo3.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookMedical, faChartPie, faWallet } from '@fortawesome/free-solid-svg-icons';
import { faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { faPersonHalfDress } from '@fortawesome/free-solid-svg-icons/faPersonHalfDress';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const DoctorSidebar=()=>{
    const navigate=useNavigate()
    function handleLogout(){
        Cookies.remove("accessToken")
        Cookies.remove("refreshToken")
        navigate("/doctor/login")

    }



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
              className="flex items-center px-4 py-2 gap-5 text-[#364f6b] hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faChartPie} />
              Dashboard
            </span>
            <span
              onClick={() => navigate("/doctor/addSlot")}
              className="flex items-center px-4 py-2 mt-2 gap-5 text-[#364f6b] hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faPersonHalfDress} />
              Slots
            </span>
            <span
              onClick={() => navigate("/doctor/appointment")}
              className="flex items-center px-4 py-2 mt-2 gap-5 text-[#364f6b] hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faBookMedical} />
              Bookings
            </span>
            <span
              onClick={() => navigate("/doctor/profile")}
              className="flex items-center px-4 py-2 mt-2 gap-5 text-[#364f6b] hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faUserDoctor} />
              Doctor Profile
            </span>

            <span
              onClick={() => navigate("/doctor/wallet")}
              className="flex items-center px-4 py-2 mt-2 gap-5 text-[#364f6b] hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faWallet} />
              Wallet
            </span>

            <span
              onClick={handleLogout}
              className="flex cursor-pointer items-center px-4 py-2 mt-2 gap-5 text-[#364f6b] hover:bg-gray-700"
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