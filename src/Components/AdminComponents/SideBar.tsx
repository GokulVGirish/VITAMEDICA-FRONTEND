import logo from "@/assets/logo4.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faChartPie,
  faHandHoldingDollar,
  faMoneyBillTransfer,
} from "@fortawesome/free-solid-svg-icons";
import { faUserDoctor } from "@fortawesome/free-solid-svg-icons";
import { faPersonHalfDress } from "@fortawesome/free-solid-svg-icons/faPersonHalfDress";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const AdminSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const handleLogout = () => {
    Cookies.remove("adminAccessToken");
    Cookies.remove("adminRefreshToken");
    navigate("/admin/login");
  };
  const isActive = (path: string) => {
    const pathnameSplitted = location.pathname.split("/");
    const newPath1 = pathnameSplitted.slice(0, 3);
    return newPath1.join("/") === path;
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4  right-4 z-50 p-4 bg-[#56aac6] text-white rounded-full shadow-lg"
      >
        <span>☰</span>
      </button>

      <div
        className={`fixed inset-0 top-0 left-0 lg:static lg:w-64  bg-[#56aac6] shadow-md transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{ zIndex: 1000 }}
      >
        <div className="flex  items-center justify-center h-16 bg-[#56aac6]">
          <span className="text-white  font-bold uppercase">
            <img
              onClick={() => navigate("/admin")}
              src={logo}
              alt="logo"
              className="w-44 rounded-md shadow-xl cursor-pointer"
            />
          </span>
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
              onClick={() => navigate("/admin")}
              className={`flex cursor-pointer hover:rounded-md hover:text-white items-center px-4 py-2 gap-5 ${
                isActive("/admin")
                  ? `text-white bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold`}
            >
              <FontAwesomeIcon icon={faChartPie} />
              Dashboard
            </span>
            <span
              onClick={() => navigate("/admin/refunds")}
              className={`flex cursor-pointer hover:rounded-md hover:text-white items-center px-4 py-2 gap-5 ${
                isActive("/admin/refunds")
                  ? `text-white bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold`}
            >
              <FontAwesomeIcon icon={faMoneyBillTransfer} />
              Refunds
            </span>
            <span
              onClick={() => navigate("/admin/withdrawals")}
              className={`flex cursor-pointer hover:rounded-md hover:text-white items-center px-4 py-2 gap-5 ${
                isActive("/admin/withdrawals")
                  ? `text-white bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold`}
            >
              <FontAwesomeIcon icon={faHandHoldingDollar} />
              Withdrawals
            </span>
            <span
              onClick={() => navigate("/admin/appointments")}
              className={`flex cursor-pointer hover:rounded-md hover:text-white items-center px-4 py-2 gap-5 ${
                isActive("/admin/appointments")
                  ? `text-white bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold`}
            >
              <FontAwesomeIcon icon={faCalendarCheck} />
              Appointments
            </span>
            <span
              onClick={() => navigate("/admin/verifyDoctor")}
              className={`flex cursor-pointer hover:rounded-md hover:text-white items-center px-4 py-2 gap-5 ${
                isActive("/admin/verifyDoctor") ||
                isActive("/admin/verifyDoctorDetail")
                  ? `text-white bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold`}
            >
              <FontAwesomeIcon icon={faPersonHalfDress} />
              Doctor verification
            </span>
            <span
              onClick={() => navigate("/admin/departments")}
              className={`flex cursor-pointer hover:rounded-md hover:text-white items-center px-4 py-2 gap-5 ${
                isActive("/admin/departments")
                  ? `text-white bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold`}
            >
              <FontAwesomeIcon icon={faLayerGroup} />
              Departments
            </span>
            <span
              onClick={() => navigate("/admin/doctors")}
              className={`flex cursor-pointer hover:rounded-md hover:text-white items-center px-4 py-2 gap-5 ${
                isActive("/admin/doctors")
                  ? `text-white bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold`}
            >
              <FontAwesomeIcon icon={faUserDoctor} />
              Doctors
            </span>
            <span
              onClick={() => navigate("/admin/users")}
              className={`flex cursor-pointer hover:rounded-md hover:text-white items-center px-4 py-2 gap-5 ${
                isActive("/admin/users")
                  ? `text-white bg-gray-700 rounded-md`
                  : `text-[#364f6b]`
              } hover:font-bold`}
            >
              <FontAwesomeIcon icon={faUsers} />
              Users
            </span>
            <span
              onClick={handleLogout}
              className="flex items-center cursor-pointer px-4 py-2 gap-5 text-[#364f6b] hover:text-white hover:rounded-md hover:font-bold mt-2"
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
};
export default AdminSideBar;
