import logo from "@/assets/logo4.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookMedical,
  faChartPie,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { faUserDoctor } from "@fortawesome/free-solid-svg-icons";
import { faPersonHalfDress } from "@fortawesome/free-solid-svg-icons/faPersonHalfDress";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

import { useAppDispatch } from "../../Redux/hoocks";
import { clearDoctor } from "../../Redux/doctorSlice";
import { useState } from "react";
import instance from "../../Axios/doctorInstance";

const DoctorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  async function handleLogout() {
  await instance.post(`/auth/logout`);
    navigate("/doctor/login");
    dispatch(clearDoctor());
  }
  const isActive = (path: string) => {
    const splittedPathname = location.pathname.split("/").slice(0, 3).join("/");

    return path == splittedPathname;
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <>
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 right-4 z-50 p-4 text-white rounded-full shadow-lg transition duration-300 bg-gradient-to-br from-[#56aac6] to-black hover:from-[#44a1b0] hover:to-gray-900"
        >
          <span className="block text-2xl font-semibold">☰</span>
        </button>
      )}

      <div
        className={`fixed inset-0 lg:static lg:w-64 bg-gradient-to-b from-[#56aac6] to-[#364f6b] shadow-lg transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{ zIndex: 50 }}
      >
        <div className="flex items-center justify-center h-16 bg-[#56aac6] shadow-md">
          <img
            src={logo}
            onClick={() => navigate("/doctor")}
            alt="logo"
            className="w-44 rounded-lg cursor-pointer transition duration-300 hover:scale-105"
          />
          <span
            onClick={toggleSidebar}
            className="text-white absolute lg:hidden top-5 right-5 cursor-pointer"
          >
            ✕
          </span>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-2  ">
            {[
              { label: "Dashboard", path: "/doctor", icon: faChartPie },
              {
                label: "Slots",
                path: "/doctor/addSlot",
                icon: faPersonHalfDress,
              },
              {
                label: "Appointments",
                path: "/doctor/appointment",
                additionalPaths: ["/doctor/userProfile"],
                icon: faBookMedical,
              },
              {
                label: "Doctor Profile",
                path: "/doctor/profile",
                icon: faUserDoctor,
              },
              { label: "Wallet", path: "/doctor/wallet", icon: faWallet },
            ].map(({ label, path, icon, additionalPaths = [] }) => (
              <span
                key={label}
                onClick={() => navigate(path)}
                className={`flex items-center cursor-pointer px-4 py-3 text-white rounded-md transition duration-300 gap-4 text-lg font-semibold ${
                  isActive(path) || additionalPaths.some(isActive)
                    ? " bg-[#1b2838]"
                    : " hover:bg-[#3c4e64] hover:text-white"
                }`}
              >
                <FontAwesomeIcon icon={icon} />
                {label}
              </span>
            ))}

            <span
              onClick={handleLogout}
              className="flex items-center cursor-pointer px-4 py-3 rounded-md transition duration-300 gap-4 text-lg font-semibold text-[#ff6666] hover:bg-[#512e2e] hover:text-white"
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
export default DoctorSidebar;
