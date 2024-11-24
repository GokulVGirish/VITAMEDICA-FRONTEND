import logo from '@/assets/logo2.png';
import { useState,useEffect,useRef,useContext } from 'react';
import Cookies from 'js-cookie';
import { useNavigate ,useLocation} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Redux/hoocks';
import { clearErrorMessage,clearUser } from '../../Redux/userSlice';
import { SocketContext } from '../../socketio/SocketIo';
import instance from '../../Axios/userInstance';
const Navbar=()=>{
   const [isOpen, setIsOpen] = useState(false);
   const {user}=useAppSelector((state)=>state.user)
   const navigate=useNavigate()
   const dispatch=useAppDispatch()
   const location=useLocation()   
  const dropdownRef = useRef<HTMLDivElement>(null);
  const socket=useContext(SocketContext)
  

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const handleLogout=async()=>{
        socket?.emit("logout");
        await instance.post(`/auth/logout`);
      dispatch(clearUser())
      dispatch(clearErrorMessage())
      navigate("/login")
      


    }
   
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

    const isActive=(path:string)=>path===location.pathname
    
     useEffect(() => {
       if (isOpen) {
         document.addEventListener("mousedown", handleClickOutside);
       } else {
         document.removeEventListener("mousedown", handleClickOutside);
       }

       return () => {
         document.removeEventListener("mousedown", handleClickOutside);
       };
     }, [isOpen]);


    return (
      <div className="sticky top-0 z-20 ">
        <nav className="flex justify-between relative bg-[#928EDE] text-white w-screen">
          <div className="px-5 xl:px-12 py-6 flex w-full items-center justify-between ">
            <a className="text-3xl font-bold font-heading" href="#">
              <img
                onClick={() => navigate("/")}
                className="h-9 rounded-lg w-44 shadow-md"
                src={logo}
                alt="logo"
              />
            </a>

            <ul className="hidden mx-auto xl:mx-0 md:flex px-4  items-center font-semibold font-heading space-x-12 pr-28">
              <li>
                <span
                  onClick={() => navigate("/")}
                  className={` ${
                    isActive("/") ? "text-white" : "text-[#364f6b]"
                  }  cursor-pointer font-bold hover:text-gray-200`}
                >
                  Home
                </span>
              </li>
              <li>
                <span
                  onClick={() => navigate("/doctorBooking")}
                  className={` ${
                    isActive("/doctorBooking") ? "text-white" : "text-[#364f6b]"
                  }  cursor-pointer font-bold hover:text-gray-200`}
                >
                  Book Appointments
                </span>
              </li>
              <li>
                <span
                  onClick={() => navigate("/contact")}
                  className={` ${
                    isActive("/contact") ? "text-white" : "text-[#364f6b]"
                  }  cursor-pointer font-bold hover:text-gray-200`}
                >
                  Contact Us
                </span>
              </li>
            </ul>

            <div className="hidden xl:flex space-x-5 items-center">
              <span className="flex items-center hover:text-gray-200">
                <div className="relative flex flex-col items-center">
                  <button
                    id="dropdownDefaultButton"
                    onClick={toggleDropdown}
                    className="text-white font-medium rounded-lg text-sm px-3 text-center inline-flex items-center"
                    type="button"
                  >
                    {/* User Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-9 hover:h-10 hover:w-10 hover:rounded-full hover:shadow-xl hover:border-[#364f6b] hover:text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="#364f6b"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>

                  {user && (
                    <div
                      onClick={toggleDropdown}
                      className="flex items-center hover:scale-110 transition-transform  cursor-pointer  space-x-2"
                    >
                      <p className="rounded-md px-2 text-[#364f6b] font-bold">
                        {(user as string).split("")[0].toLocaleUpperCase() +
                          (user as string).slice(1).toLocaleLowerCase()}
                      </p>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-[#364f6b] hover:text-gray-500 transition-colors duration-300 ease-in-out"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </span>
            </div>
          </div>

          <span
            onClick={toggleDropdown}
            className="navbar-burger cursor-pointer flex items-center space-x-2 mr-12 xl:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 hover:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#364f6b"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {user && (
              <p className="rounded-md hover:scale-110 transition-transform px-2 hover:stroke-gray-200 text-[#364f6b] font-bold">
                {(user as string).split(" ")[0].slice(0, 1) +
                  (user as string).split(" ")[0].slice(1)}
              </p>
            )}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4  text-[#364f6b] hover:scale-110 transition-transform "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>

          {isOpen && (
            <div
              ref={dropdownRef}
              className="z-10 absolute top-20 right-3  bg-white divide-y divide-gray-100 rounded-lg shadow w-36 dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefaultButton"
              >
                {/* <li>
                            <span onClick={()=>navigate("/")} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">Home</span>
                        </li> */}
                {user ? (
                  <>
                    <li>
                      <span
                        onClick={() => navigate("/profile")}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                      >
                        Profile
                      </span>
                    </li>

                    <li>
                      <span
                        onClick={handleLogout}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                      >
                        Sign out
                      </span>
                    </li>
                  </>
                ) : (
                  <li>
                    <span
                      onClick={() => navigate("/login")}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                    >
                      Login
                    </span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </nav>
        <div className="w-full  md:hidden bg-[#928EDE]  h-10">
          <ul className="flex text-md  text-[#364f6b] font-bold justify-around items-center">
            <li onClick={() => navigate("/")} className="mt-2">
              Home
            </li>
            <li onClick={() => navigate("/doctorBooking")} className="mt-2">
              Book Appointments
            </li>
            <li onClick={() => navigate("/contact")} className="mt-2">
              Contact
            </li>
          </ul>
        </div>
      </div>
    );
}
export default Navbar