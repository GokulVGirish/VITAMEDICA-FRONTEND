
import logo from "@/assets/cover1.jpg";
import { faCircleLeft, faCircleRight, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import moment from "moment";
import adminInstance from "../../Axios/adminInstance";
import { AxiosError } from "axios";
import AppointmentDetailModal from "./AppointmentDetailModal";




const AdminDoctorProfile=()=>{
     const { id } = useParams();
     const [doctor, setDoctor] = useState<any>(null);
      const [currentPage, setCurrentPage] = useState(1);
     const [showAppointments, setShowAppointments] = useState(false);
     const [totalAppointmentCount,setTotalAppointmentCount]=useState<number>(1)
     const [appointments, setAppointments] = useState<any[]>([]);
     const [appointmentsPage, setAppointmentsPage] = useState(1);
     const [appointmentDetailModal,setAppointmentDetailModal]=useState(false)
     const [selectedAppointment,setSelectedAppointment]=useState<string|null>(null)
    
    

 

     const getDoctorInfo=useCallback(async()=>{
        try{
            setDoctor((prevDoctor:any) => ({
              ...prevDoctor,
              reviews: [],
            }));

             const response = await adminInstance.get(
               `/doctors/${id}/profile?page=${currentPage}&limit=3`
             );

             if (response.data.success) {
                console.log(response.data.data)
               setDoctor(response.data.data);
             }

        }
        catch(error){
            if(error instanceof AxiosError){
                console.log(error)
            }

        }

     },[id,currentPage])
     useEffect(()=>{
        getDoctorInfo()

     },[getDoctorInfo])
     const fetchDoctorAppointmentInfo=useCallback(async(page:number=1)=>{
      try{
         
          const response = await adminInstance.get(
            `/doctors/${id}/appointments?page=${page}&limit=10`
          );
          if (response.data.success) {
         
            setAppointments(response?.data?.data.data);
            setTotalAppointmentCount(response.data.data.totalCount.count);
          }

      }
      catch(error){
        

      }
     

     },[appointmentsPage])
     console.log("appointments",appointments)
      const handleShowAppointments = () => {
        setShowAppointments(true);
        fetchDoctorAppointmentInfo(appointmentsPage);
      };

      const handleBackToProfile = () => {
        setShowAppointments(false);
        setAppointmentsPage(1); 
        setAppointments([])
        setTotalAppointmentCount(1)
      };

      const handlePreviousPage = () => {
        if (appointmentsPage > 1) {
          setAppointmentsPage((prevPage) => prevPage - 1);
          fetchDoctorAppointmentInfo(appointmentsPage - 1);
        }
      };

      const handleNextPage = () => {
      if(appointmentsPage<Math.ceil(totalAppointmentCount as number/10)){
          setAppointmentsPage((prevPage) => prevPage + 1);
          fetchDoctorAppointmentInfo(appointmentsPage + 1);
      }
      };

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
                         doctor?.image ||
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
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={handleBackToProfile}
                       >
                         Go TO Profile
                       </motion.button>
                     ) : (
                       <motion.button
                         className="bg-gray-700 active:bg-pink-600 uppercase text-white font-bold hover:bg-gray-800 hover:scale-105 hover:shadow-lg shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                         whileHover={{ scale: 1.1 }}
                         whileTap={{ scale: 0.95 }}
                         onClick={handleShowAppointments}
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
                         <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                           Date
                         </th>
                         <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                           Time
                         </th>
                         <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                           User
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
                               {moment(appointment?.date).format(
                                 "MMMM D, YYYY"
                               )}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                               {moment(appointment?.start).format("h:mm A")}-{" "}
                               {moment(appointment?.end).format("h:mm A")}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                               {appointment?.userName}
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
                 <div className="doctorInfo">
                   <div className="text-center mt-12 mb-4">
                     <motion.h3
                       className="text-4xl font-semibold leading-normal text-blueGray-700 mb-2"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ duration: 0.6, delay: 0.2 }}
                     >
                       Dr &nbsp;{doctor?.name}
                     </motion.h3>
                     <motion.div
                       className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ duration: 0.6, delay: 0.3 }}
                     >
                       <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                       {doctor?.degree}
                     </motion.div>
                     <motion.p
                       className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold "
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ duration: 0.6, delay: 0.3 }}
                     >
                       <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                       email: {doctor?.email}
                     </motion.p>
                     <motion.p
                       className="text-sm leading-normal mt-0 mb-0 text-blueGray-400 font-bold "
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ duration: 0.6, delay: 0.3 }}
                     >
                       <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                       phone: {doctor?.phone}
                     </motion.p>
                     <motion.p
                       className="text-sm leading-normal mt-0 mb-1 text-blueGray-400 font-bold "
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ duration: 0.6, delay: 0.3 }}
                     >
                       <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                       fees: ₹{doctor?.fees}
                     </motion.p>
                     <motion.p
                       className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold "
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ duration: 0.6, delay: 0.3 }}
                     >
                       <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                       Blocked Status:{" "}
                       {doctor?.isBlocked ? "Blocked" : "Unblocked"}
                     </motion.p>
                   </div>
                   <motion.div
                     className="mt-3   text-center"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ duration: 0.6, delay: 0.6 }}
                   >
                     <div className="flex flex-col items-center flex-wrap justify-center">
                       <h1 className="text-center text-3xl font-semibold mb-3">
                         Doctor Description
                       </h1>
                       <div className="w-full lg:w-9/12 px-4">
                         <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                           {doctor?.description}
                         </p>
                       </div>
                     </div>
                     {/* photos */}
                     <div className="bg-white dark:bg-gray-700 h-[422px] rounded-lg py-6 sm:py-8 lg:py-12">
                       <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:gap-6 xl:gap-8">
                           <span className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80">
                             <img
                               src={doctor?.documents?.certificateImage}
                               loading="lazy"
                               onClick={() => {
                                 window.open(
                                   doctor?.documents?.certificateImage
                                 );
                               }}
                               alt="Certificate Image"
                               className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                             />
                             <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
                             <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">
                               Certificate Image
                             </span>
                           </span>
                           {/* Image - End */}

                           {/* Image - Start */}
                           <span className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80">
                             <img
                               src={doctor?.documents?.qualificationImage}
                               loading="lazy"
                               onClick={() => {
                                 window.open(
                                   doctor?.documents?.qualificationImage
                                 );
                               }}
                               alt="Qualification Image"
                               className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                             />
                             <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
                             <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">
                               Qualification Image
                             </span>
                           </span>
                           <span className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80">
                             <img
                               src={doctor?.documents?.aadarFrontImage}
                               loading="lazy"
                               onClick={() => {
                                 window.open(
                                   doctor?.documents?.aadarFrontImage
                                 );
                               }}
                               alt="Aadar Front"
                               className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                             />
                             <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
                             <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">
                               Aadar Front
                             </span>
                           </span>
                           <span className="group relative flex h-48 items-end overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-80">
                             <img
                               src={doctor?.documents?.aadarBackImage}
                               loading="lazy"
                               alt="Aadar Back"
                               onClick={() => {
                                 window.open(doctor?.documents?.aadarBackImage);
                               }}
                               className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                             />
                             <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent opacity-50"></div>
                             <span className="relative ml-4 mb-3 inline-block text-sm text-white md:ml-5 md:text-lg">
                               Aadar Back
                             </span>
                           </span>
                           {/* Image - End */}
                         </div>
                       </div>
                     </div>

                     {/* photos */}
                     {/* review */}
                     <section className="bg-white px-4 pb-12 md:py-10">
                       <div className="max-w-screen-xl mx-auto">
                         <h2 className="font-black text-black text-center text-3xl leading-none uppercase max-w-2xl mx-auto mb-12">
                           What Patients Are Saying
                         </h2>
                         {/* new */}

                         <div className="mt-10 mb-6 pl-2 flex items-center justify-start gap-x-6">
                           <div className="hidden sm:block -space-x-2 overflow-hidden">
                             <FontAwesomeIcon
                               className="h-10 w-10"
                               icon={faUsers}
                             />
                           </div>
                           <div className="border-none sm:border-l-2 border-black sm:pl-3">
                             <div className="flex justify-center sm:justify-start items-center">
                               <h3 className="text-2xl font-semibold mr-2">
                                 {doctor?.averageRating}
                               </h3>
                               <svg
                                 className="text-yellow-500 w-6 h-6"
                                 xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 20 20"
                                 fill="currentColor"
                               >
                                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                               </svg>
                             </div>
                             <div>
                               <h3 className="text-sm">
                                 Rated by {doctor?.totalReviews || 0} on
                                 Vitamedica
                               </h3>
                             </div>
                           </div>
                         </div>

                         {/* new */}
                         <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
                           {/* Testimonial 1 */}
                           {doctor?.reviews?.map((review: any) => {
                             return (
                               <div
                                 key={review.appointmentId}
                                 className="bg-gray-200 rounded-lg p-8 text-center md:w-1/3"
                               >
                                 <p className="text-xs mb-2">
                                   Posted on{" "}
                                   {moment(review?.createdAt).format(
                                     "MMMM D, YYYY"
                                   )}
                                 </p>

                                 <p className="font-bold uppercase">
                                   {review.userName}
                                 </p>
                                 <p className="text-xl font-light italic text-gray-700">
                                   {review.comment}
                                 </p>
                                 <div className="flex items-center justify-center space-x-2 mt-4">
                                   {Array.from({ length: review.rating }).map(
                                     (_, index) => {
                                       return (
                                         <svg
                                           key={index}
                                           className="text-yellow-500 w-5 h-5"
                                           xmlns="http://www.w3.org/2000/svg"
                                           viewBox="0 0 20 20"
                                           fill="currentColor"
                                         >
                                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                         </svg>
                                       );
                                     }
                                   )}
                                 </div>
                               </div>
                             );
                           })}
                         </div>
                         {doctor?.reviews.length === 0 && (
                           <div className="flex justify-center">
                             <h3 className="text-center">No reviews yet</h3>
                           </div>
                         )}
                       </div>
                     </section>
                     {doctor?.reviews.length > 0 && (
                       <div className=" flex items-end justify-center gap-6">
                         <FontAwesomeIcon
                           onClick={() => {
                             if (currentPage > 1) {
                               setCurrentPage((prevState) => prevState - 1);
                             }
                           }}
                           className="h-11 transition-transform duration-300 ease-in-out transform hover:scale-125 cursor-pointer"
                           icon={faCircleLeft}
                         />
                         <FontAwesomeIcon
                           onClick={() => {
                             if (
                               currentPage < Math.ceil(doctor.totalReviews / 3)
                             ) {
                               setCurrentPage((prevState) => prevState + 1);
                             }
                           }}
                           className="h-11 transition-transform duration-300 ease-in-out transform hover:scale-125 cursor-pointer"
                           icon={faCircleRight}
                         />
                       </div>
                     )}

                     {/* review */}
                   </motion.div>
                 </div>
               )}
             </div>
           </motion.div>
         </div>
       </section>
       {appointmentDetailModal && (
         <AppointmentDetailModal
           id={selectedAppointment as string}
           closeModal={() => setAppointmentDetailModal(false)}
         />
       )}
     </main>
   );
}
export default AdminDoctorProfile