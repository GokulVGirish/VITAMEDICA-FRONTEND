import logo from "@/assets/cover1.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import adminInstance from "../../Axios/adminInstance";
import { User } from "./UserListing";
import calculateAge from "../../hooks and functions/calculateAge";
import { faCircleLeft, faCircleRight } from "@fortawesome/free-solid-svg-icons";
import AppointmentDetailModal from "./AppointmentDetailModal";

const AdminUserProfile = () => {
    const [user,setUser]=useState<User|null>(null)
    const {id}=useParams()
    const [showAppointments,setShowAppointments]=useState(false)
     const [totalAppointmentCount, setTotalAppointmentCount] =
       useState<number>(1);
     const [appointments, setAppointments] = useState<any[]>([]);
     const [appointmentsPage, setAppointmentsPage] = useState(1);
     const [appointmentDetailModal, setAppointmentDetailModal] =
       useState(false);
     const [selectedAppointment, setSelectedAppointment] = useState<
       string | null
     >(null);

    const getUserProfile=useCallback(async()=>{
        const response=await adminInstance.get(`/users/${id}/profile`)
        console.log(response.data.user)
        setUser(response.data.user)

    },[id])
    useEffect(()=>{
        getUserProfile()

    },[getUserProfile])
    const fetchUserAppointmentInfo=useCallback(async (page:number=1)=>{

      try{
     const response = await adminInstance.get(`/users/${id}/appointments?page=${page}&limit=10`);
     if(response.data.success){
      setAppointments(response.data.data.data)
      setTotalAppointmentCount(response.data.data.count)

     }

      }
      catch(error){

      }

    },[appointmentsPage])
     const handleShowAppointments = () => {
       setShowAppointments(true);
       fetchUserAppointmentInfo();
     };
        const handleBackToProfile = () => {
          setShowAppointments(false);
          setAppointmentsPage(1);
          setAppointments([]);
          setTotalAppointmentCount(1);
        };

        const handlePreviousPage = () => {
          if (appointmentsPage > 1) {
            setAppointmentsPage((prevPage) => prevPage - 1);
            fetchUserAppointmentInfo(appointmentsPage - 1);
          }
        };

        const handleNextPage = () => {
          if (
            appointmentsPage < Math.ceil((totalAppointmentCount as number) / 10)
          ) {
            setAppointmentsPage((prevPage) => prevPage + 1);
            fetchUserAppointmentInfo(appointmentsPage + 1);
          }
        };
        console.log("totalAppointmnetcount",totalAppointmentCount)

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
                    {showAppointments ? (
                      <motion.button
                        className="bg-gray-700 active:bg-pink-600 uppercase text-white font-bold hover:bg-gray-800 hover:scale-105 hover:shadow-lg shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                        onClick={handleBackToProfile}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        go to Profile
                      </motion.button>
                    ) : (
                      <motion.button
                        className="bg-gray-700 active:bg-pink-600 uppercase text-white font-bold hover:bg-gray-800 hover:scale-105 hover:shadow-lg shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                        onClick={handleShowAppointments}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Appointments History
                      </motion.button>
                    )}
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-1"></div>
              </div>
              {/* here */}
              {showAppointments ? (
                <motion.div
                  className="flex flex-col justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.table
                    className="min-w-ful bg-white rounded-lg overflow-hidden shadow-lg"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <thead className="bg-gray-800 text-white">
                      <tr>
                        {/* Table headers */}
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                          Doctor
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                          Booked On
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                          Amount Payed
                        </th>
                        <th className="px-6 py-3 border-b-2 border-gray-300 text-xs font-semibold uppercase tracking-wider">
                          View
                        </th>
                      </tr>
                    </thead>
                    <motion.tbody
                      className="bg-white divide-y divide-gray-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      {appointments &&
                        appointments.map((appointment) => (
                          <motion.tr
                            key={appointment._id}
                            className="hover:bg-gray-100 transition-all"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {moment(appointment?.date).format("MMMM D, YYYY")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {moment(appointment?.start).format("h:mm A")}-{" "}
                              {moment(appointment?.end).format("h:mm A")}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {appointment?.doctorName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {moment(appointment?.createdAt).format(
                                "MMMM D, YYYY"
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                className={`py-1 px-2.5 border-none rounded text-base font-medium w-24 text-center ${
                                  appointment?.status === "completed"
                                    ? "text-green-800 bg-green-100"
                                    : appointment?.status === "pending"
                                    ? "text-yellow-800 bg-yellow-100"
                                    : "text-red-800 bg-red-100"
                                }`}
                              >
                                {appointment?.status}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {appointment?.fees}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => {
                                  setAppointmentDetailModal(true);
                                  setSelectedAppointment(appointment._id);
                                }}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded w-20 text-center"
                              >
                                View
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                    </motion.tbody>
                  </motion.table>
                  {appointments?.length === 0 && (
                    <motion.div
                      className="flex min-w-full h-10 font-bold shadow-lg text-white px-5 items-center justify-center bg-gray-800 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      No Appointments Yet
                    </motion.div>
                  )}
                  {appointments?.length !== 0 && (
                    <motion.div
                      className="flex items-end mt-4 justify-center gap-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <FontAwesomeIcon
                        onClick={handlePreviousPage}
                        className="h-11 transition-transform duration-300 ease-in-out transform hover:scale-125 cursor-pointer"
                        icon={faCircleLeft}
                      />
                      <FontAwesomeIcon
                        onClick={handleNextPage}
                        className="h-11 transition-transform duration-300 ease-in-out transform hover:scale-125 cursor-pointer"
                        icon={faCircleRight}
                      />
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <>
                  <div className="text-center mt-12 mb-4 bg-gray-100 p-6 rounded-lg shadow-md">
                    <motion.h3
                      className="text-3xl font-semibold text-blueGray-700 mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      {user?.gender === "male" ? "Mr" : "Mrs"} {user?.name}
                    </motion.h3>

                    <motion.div
                      className="text-base font-bold text-blueGray-500 mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <i className="fas fa-map-marker-alt mr-2 text-blueGray-400"></i>
                      {user?.name}
                    </motion.div>

                    <motion.p
                      className="text-sm font-medium text-blueGray-500 mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <i className="fas fa-venus-mars mr-2 text-blueGray-400"></i>
                      Gender: {user?.gender}
                    </motion.p>

                    <motion.p
                      className="text-sm font-medium text-blueGray-500 mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <i className="fas fa-envelope mr-2 text-blueGray-400"></i>
                      Email: {user?.email}
                    </motion.p>

                    <motion.p
                      className="text-sm font-medium text-blueGray-500 mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <i className="fas fa-phone mr-2 text-blueGray-400"></i>
                      Phone: {user?.phone}
                    </motion.p>

                    <motion.p
                      className="text-sm font-medium text-blueGray-500 mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <i className="fas fa-birthday-cake mr-2 text-blueGray-400"></i>
                      DOB: {moment(user?.dob).format("MMMM D, YYYY")} &nbsp;
                      Age: {calculateAge(new Date(user?.dob as string))}
                    </motion.p>

                    <motion.p
                      className="text-sm font-medium text-blueGray-500 mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <i className="fas fa-tint mr-2 text-blueGray-400"></i>
                      Blood Group: {user?.bloodGroup}
                    </motion.p>

                    {user?.address?.street ? (
                      <motion.div
                        className="text-sm font-medium text-blueGray-500 mb-4 p-4 bg-blueGray-50 rounded-md shadow-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        <i className="fas fa-map-marked-alt mr-2 text-blueGray-400"></i>
                        <span className="font-bold">Address:</span> <br />
                        {user?.address?.street}, {user?.address?.state},{" "}
                        {user?.address?.city} - {user?.address?.postalCode}
                      </motion.div>
                    ) : (
                      <motion.div
                        className="text-sm font-medium text-blueGray-500 mb-4 p-4 bg-blueGray-50 rounded-md shadow-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        <i className="fas fa-map-marked-alt mr-2 text-blueGray-400"></i>
                        <span className="font-bold">
                          Address: &nbsp;No address Provided
                        </span>{" "}
                        <br />
                      </motion.div>
                    )}
                    <motion.p
                      className="text-sm font-medium text-blueGray-500 mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <i className="fas fa-ban mr-2 text-blueGray-400"></i>
                      Blocked Status:{" "}
                      {user?.isBlocked ? "Blocked" : "Unblocked"}
                    </motion.p>

                    <motion.p
                      className="text-sm font-medium text-blueGray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <i className="fas fa-user-check mr-2 text-blueGray-400"></i>
                      Registered Using: {user?.register}
                    </motion.p>
                  </div>
                </>
              )}

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
          {appointmentDetailModal && (
            <AppointmentDetailModal
              id={selectedAppointment as string}
              closeModal={() => setAppointmentDetailModal(false)}
            />
          )}
        </div>
      </section>
    </main>
  );
};
export default AdminUserProfile;
