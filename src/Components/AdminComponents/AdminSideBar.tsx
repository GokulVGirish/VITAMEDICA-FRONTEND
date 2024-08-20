import logo from '@/assets/logo3.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartPie } from '@fortawesome/free-solid-svg-icons';
import { faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { faPersonHalfDress } from '@fortawesome/free-solid-svg-icons/faPersonHalfDress';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { useNavigate,useLocation } from 'react-router-dom';



const AdminSideBar=()=>{
  const navigate=useNavigate()
   const location = useLocation();
     const handleLogout=()=>{
      Cookies.remove("adminAccessToken")
      Cookies.remove("adminRefreshToken")
      navigate("/admin/login")
      


    }
    const isActive = (path: string) => location.pathname === path;


    return (
      <div className="hidden md:flex flex-col w-64 bg-blue-600">
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
              className={`flex cursor-pointer   hover:rounded-md hover:text-white items-center px-4 py-2 gap-5  ${
                isActive("/admin")
                  ? `text-white  bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold `}
            >
              <FontAwesomeIcon icon={faChartPie} />
              Dashboard
            </span>
            <span
              onClick={() => navigate("/admin/verifyDoctor")}
              className={`flex cursor-pointer   hover:rounded-md hover:text-white items-center px-4 py-2 gap-5  ${
                isActive("/admin/verifyDoctor")
                  ? `text-white  bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold `}
            >
              <FontAwesomeIcon icon={faPersonHalfDress} />
              Doctor verification
            </span>
            <span
              onClick={() => navigate("/admin/departments")}
              className={`flex cursor-pointer   hover:rounded-md hover:text-white items-center px-4 py-2 gap-5  ${
                isActive("/admin/departments")
                  ? `text-white  bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold `}
            >
              <FontAwesomeIcon icon={faLayerGroup} />
              Departments
            </span>
            <span
              onClick={() => navigate("/admin/doctors")}
              className={`flex cursor-pointer   hover:rounded-md hover:text-white items-center px-4 py-2 gap-5  ${
                isActive("/admin/doctors")
                  ? `text-white  bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold `}
            >
              <FontAwesomeIcon icon={faUserDoctor} />
              Doctors
            </span>
            <span
              onClick={() => navigate("/admin/users")}
              className={`flex cursor-pointer   hover:rounded-md hover:text-white items-center px-4 py-2 gap-5  ${
                isActive("/admin/users")
                  ? `text-white  bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold `}
            >
              <FontAwesomeIcon icon={faUsers} />
              Users
            </span>
            <span
              onClick={handleLogout}
              className="flex items-center cursor-pointer px-4  hover:font-bold  py-2 hover:rounded-md hover:text-white mt-2 gap-5 text-[#364f6b] "
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