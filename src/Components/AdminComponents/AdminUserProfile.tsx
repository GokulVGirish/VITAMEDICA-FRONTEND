import logo from "@/assets/cover1.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import adminInstance from "../../Axios/adminInstance";
import { AxiosError } from "axios";
import { User } from "./UserListing";

const AdminUserProfile = () => {
    const [user,setUser]=useState<User|null>(null)
    const {id}=useParams()
    const getUserProfile=useCallback(async()=>{
        const response=await adminInstance.get(`/users/${id}/profile`)

    },[id])
    useEffect(()=>{
        getUserProfile()

    },[getUserProfile])
  return (
    <main
      style={{
        backgroundImage: `url(${logo})`,
        height: "50vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="profile-page pt-96"
    >
      <section className="relative block h-500-px">
        <div className="absolute bg-red-400 w-full h-full bg-center bg-cover">
          <span
            id="blackOverlay"
            className="w-full h-full absolute opacity-50 bg-black"
          ></span>
        </div>
        <div
          className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
          style={{ transform: "translateZ(0px)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <span className="text-blueGray-200 fill-current"></span>
          </svg>
        </div>
      </section>

      <section className="relative py-16 bg-blueGray-200">
        <div className="container mx-auto px-4">
          <motion.div
            className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="px-6 py-6 rounded-lg shadow-md">
              <div className="flex flex-wrap justify-center">
                <motion.div
                  className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="mx-auto">
                    <img
                      alt="..."
                      src={
                        user?.image ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                      }
                      className="shadow-xl w-40 h-40 lg:w-32 lg:h-32 rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                    />
                  </div>
                </motion.div>
                <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                  <div className="py-6 px-3 mt-32 sm:mt-0">
                    <motion.button
                      className="bg-gray-700 active:bg-pink-600 uppercase text-white font-bold hover:bg-gray-800 hover:scale-105 hover:shadow-lg shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Appointments History
                    </motion.button>
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-1"></div>
              </div>
              <div className="text-center mt-12 mb-4">
                <motion.h3
                  className="text-4xl font-semibold leading-normal text-blueGray-700 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {user?.name}
                </motion.h3>
                <motion.div
                  className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
             {user?.name}
                </motion.div>
                <motion.p
                  className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold "
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                  email: {user?.email}
                </motion.p>
                <motion.p
                  className="text-sm leading-normal mt-0 mb-0 text-blueGray-400 font-bold "
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                  phone: {user?.phone}
                </motion.p>
                <motion.p
                  className="text-sm leading-normal mt-0 mb-1 text-blueGray-400 font-bold "
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                  fees: ₹{user?.name}
                </motion.p>
                <motion.p
                  className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold "
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                  Blocked Status: {user?.isBlocked ? "Blocked" : "Unblocked"}
                </motion.p>
              </div>
              <motion.div
                className="mt-3   text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {/* <div className="flex flex-col items-center flex-wrap justify-center">
                  <h1 className="text-center text-3xl font-semibold mb-3">
                    Doctor Description
                  </h1>
                  <div className="w-full lg:w-9/12 px-4">
                    <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                      {doctor?.description}
                    </p>
                  </div>
                </div> */}
                
              
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};
export default AdminUserProfile;
