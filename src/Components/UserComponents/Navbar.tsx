import logo from '@/assets/logo2.png';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../Redux/hoocks';
import { clearErrorMessage } from '../../Redux/userSlice';
const Navbar=()=>{
   const [isOpen, setIsOpen] = useState(false);
   const navigate=useNavigate()
   const dispatch=useAppDispatch()
  

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const handleLogout=()=>{
      Cookies.remove("accessToken")
      Cookies.remove("refreshToken")
      dispatch(clearErrorMessage())
      navigate("/login")
      


    }


    return (
      <div className="sticky top-0 z-50 ">
        <nav className="flex justify-between relative bg-[#928EDE] text-white w-screen">
          <div className="px-5 xl:px-12 py-6 flex w-full items-center justify-between ">
            <a className="text-3xl font-bold font-heading" href="#">
              <img
                className="h-9 rounded-lg w-44 shadow-md"
                src={logo}
                alt="logo"
              />
            </a>

            <ul className="hidden mx-auto xl:mx-0 md:flex px-4  items-center font-semibold font-heading space-x-12 pr-28">
              <li>
                <span
                  onClick={() => navigate("/")}
                  className=" text-[#364f6b] cursor-pointer font-bold hover:text-gray-200"
                >
                  Home
                </span>
              </li>
              <li>
                <span
                  onClick={() => navigate("/doctorBooking")}
                  className="text-[#364f6b] font-bold hover:text-gray-200"
                >
                  Book Appointment
                </span>
              </li>
              <li>
                <span className="text-[#364f6b] font-bold cursor-pointer hover:text-gray-200">
                  Contact Us
                </span>
              </li>
            </ul>

            <div className="hidden xl:flex space-x-5 items-center">
              <span className="flex items-center hover:text-gray-200">
                <div className="relative">
                  <button
                    id="dropdownDefaultButton"
                    onClick={toggleDropdown}
                    className="text-white    font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center "
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 hover:text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#364f6b"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>
              </span>
            </div>
          </div>

          <span
            onClick={toggleDropdown}
            className="navbar-burger self-center mr-12 xl:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 hover:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#364f6b"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>

          {isOpen && (
            <div
              id="dropdown"
              className="z-10 absolute top-20 right-3  bg-white divide-y divide-gray-100 rounded-lg shadow w-36 dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefaultButton"
              >
                {/* <li>
                            <span onClick={()=>navigate("/")} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">Home</span>
                        </li> */}
                <li>
                  <span
                    onClick={() => navigate("/profile")}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                  >
                    Profile
                  </span>
                </li>
                {/* <li>
                            <span className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">Login</span>
                        </li> */}
                <li>
                  <span
                    onClick={handleLogout}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                  >
                    Sign out
                  </span>
                </li>
              </ul>
            </div>
          )}
        </nav>
        <div className="w-full  md:hidden bg-[#928EDE]  h-10">
          <ul className="flex text-md  text-[#364f6b] font-bold justify-around items-center">
            <li className='mt-2'>Home</li>
            <li className='mt-2'>Book Appointments</li>
            <li className='mt-2'>Contact</li>
          </ul>
        </div>
      </div>
    );
}
export default Navbar