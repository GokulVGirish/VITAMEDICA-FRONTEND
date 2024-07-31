import logo from '@/assets/logo3.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartPie } from '@fortawesome/free-solid-svg-icons';
import { faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { faPersonHalfDress } from '@fortawesome/free-solid-svg-icons/faPersonHalfDress';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';



const AdminSideBar=()=>{
  const navigate=useNavigate()
     const handleLogout=()=>{
      Cookies.remove("adminAccessToken")
      Cookies.remove("adminRefreshToken")
      navigate("/admin/login")
      


    }


    return (
      <div className="hidden md:flex flex-col w-64 bg-[#05acb4]">
        <div className="flex items-center justify-center h-16 bg-[#05acb4]">
          <span className="text-white font-bold uppercase">
            <img
              onClick={() => navigate("/admin")}
              src={logo}
              alt="logo"
              className=" w-44 rounded-lg shadow-xl"
            />
          </span>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 bg-[#05acb4]">
            <span
              onClick={() => navigate("/admin")}
              className="flex items-center px-4 py-2 gap-5 text-[#364f6b] hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faChartPie} />
              Profile
            </span>
            <span
              onClick={() => navigate("/admin/verifyDoctor")}
              className="flex items-center px-4 py-2 mt-2 gap-5 text-[#364f6b] hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faPersonHalfDress} />
              Doctor verification
            </span>
            <span
              onClick={() => navigate("/admin/departments")}
              className="flex items-center px-4 py-2 mt-2 gap-5 text-[#364f6b] hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faLayerGroup} />
              Departments
            </span>
            <span
              onClick={() => navigate("/admin/doctors")}
              className="flex items-center px-4 py-2 mt-2 gap-5 text-[#364f6b] hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faUserDoctor} />
              Doctors
            </span>
            <span
              onClick={() => navigate("/admin/users")}
              className="flex items-center px-4 py-2 mt-2 gap-5 text-[#364f6b] hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faUsers} />
              Users
            </span>
            <span
              onClick={handleLogout}
              className="flex items-center px-4 py-2 mt-2 gap-5 text-[#364f6b] hover:bg-gray-700"
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              Logout
            </span>
          </nav>
        </div>
      </div>
    );
}
export default AdminSideBar