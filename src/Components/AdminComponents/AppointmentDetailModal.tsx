import { faCircleXmark, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PdfViewer from "../extra/PdfViewer";
import { useCallback, useEffect, useState } from "react";
import adminInstance from "../../Axios/adminInstance";
import moment from "moment";

const AppointmentDetailModal=({closeModal,id}:{closeModal:()=>void,id:string})=>{
    

     const [data, setData] = useState<any>();
  const [pdfModal, setPdfModal] = useState(false);

  const fetchAppointmentDetail = useCallback(async () => {
    try {
      const response = await adminInstance.get(`/appointments/${id}`);
      if (response.data.success) {
        setData(response.data.data);
      
      }
    } catch (error) {
      console.error("Error fetching appointment details", error);
    }
  }, [id]);

  useEffect(() => {
    fetchAppointmentDetail();
  }, [fetchAppointmentDetail]);

    
     return (
       <div
         className="relative z-30"
         aria-labelledby="crop-image-dialog"
         role="dialog"
         aria-modal="true"
       >
         <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
         <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto">
           <div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-transparent text-slate-100 text-left transition-all">
             <section className="antialiased bg-gradient-to-r p-6">
               <div className="h-full">
                 <div className="relative px-6 sm:px-8 lg:px-10 pb-10 max-w-4xl mx-auto">
                   <div className="bg-white relative px-10 py-8 rounded-lg shadow-lg">
                     <button
                       type="button"
                       className="rounded-md p-1 inline-flex items-center justify-center text-gray-700 hover:bg-gray-700 focus:outline-none absolute top-2 right-2"
                       onClick={closeModal}
                     >
                       <FontAwesomeIcon
                         onClick={closeModal}
                         icon={faCircleXmark}
                       />
                     </button>
                     <div className="text-center mb-8">
                       <h1 className="text-3xl leading-snug text-gray-800 font-semibold mb-6">
                         Appointment Detail
                       </h1>
                       <div className="flex justify-center gap-14">
                         <div className="flex flex-col items-center text-center">
                           <img
                             className="inline-flex border-4 border-gray-300 rounded-full shadow-lg"
                             src={
                               data?.docImage ||
                               "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOu8l8KLZ2eDXLQEgKEdzibQETXGc1CfFj28ttb6x63FTFqnnXZDZGpiZ4TcRt1zvtLr8&usqp=CAU"
                             }
                             width="100"
                             height="100"
                             alt="Doctor"
                           />
                           <span className="text-xs">Doctor</span>
                           <h3 className="mt-3 text-xl font-semibold text-gray-700">
                             Dr {data?.docName}
                           </h3>
                           <p className="text-base text-gray-500">
                             Department: {data?.department}
                           </p>
                         </div>
                         <div className="flex flex-col items-center text-center">
                           <img
                             className="inline-flex border-4 border-gray-300 rounded-full shadow-lg"
                             src={
                               data?.userImage ||
                               "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOu8l8KLZ2eDXLQEgKEdzibQETXGc1CfFj28ttb6x63FTFqnnXZDZGpiZ4TcRt1zvtLr8&usqp=CAU"
                             }
                             width="100"
                             height="100"
                             alt="User"
                           />
                           <span className="text-xs">Patient</span>
                           <h3 className="mt-3 text-xl font-semibold text-gray-700">
                             {data?.userName}
                           </h3>
                           <p className="text-base text-gray-500">
                             DOB: {moment(data?.userAge).format("MMMM D, YYYY")}
                           </p>
                           <p className="text-base text-gray-500">
                             Blood Group: {data?.userBlood}
                           </p>
                         </div>
                       </div>
                     </div>

                     <div className="space-y-6 bg-slate-100 p-6 rounded-xl">
                       <div className="flex flex-col items-center">
                         <span className="block text-lg font-medium text-gray-700">
                           Appointment Date:{" "}
                           {moment(data?.date).format("MMMM D, YYYY")}
                         </span>
                       </div>
                       <div className="flex flex-col items-center">
                         <span className="block text-lg font-medium text-gray-700">
                           Appointment Time:{" "}
                           {moment(data?.start).format("h:mm A")} -{" "}
                           {moment(data?.end).format("h:mm A")}
                         </span>
                       </div>
                       <div className="flex flex-col items-center">
                         <span className="block text-lg font-medium text-gray-700">
                           Appointment Booked On:{" "}
                           {moment(data?.createdAt).format("MMMM D, YYYY")}
                         </span>
                       </div>
                       <div className="flex flex-col items-center">
                         <span className="block text-lg font-medium text-gray-700">
                           Appointment Amount: ₹{data?.amount}
                         </span>
                       </div>
                       <div className="flex flex-col items-center">
                         <span className="block text-lg font-medium text-gray-700">
                           Doctor's Fees: ₹{data?.fees}
                         </span>
                       </div>
                       <div className="flex flex-col items-center">
                         <span className="block text-lg font-medium text-gray-700">
                           Appointment Status:{" "}
                           <span
                             className={`py-2 px-3 border-none rounded-lg text-xl font-semibold ${
                               data?.status === "completed"
                                 ? "text-green-800 bg-green-100"
                                 : data?.status === "pending"
                                 ? "text-yellow-800 bg-yellow-100"
                                 : "text-red-800 bg-red-100"
                             }`}
                           >
                             {data?.status}
                           </span>
                         </span>
                       </div>
                       {data?.prescription && (
                         <div className="flex flex-col items-center">
                           <span className="block text-lg font-medium text-gray-700">
                             Prescription:{" "}
                             <FontAwesomeIcon
                               onClick={() => setPdfModal(true)}
                               className="cursor-pointer text-red-600 hover:text-red-800 transition-colors duration-200"
                               icon={faFilePdf}
                             />
                           </span>
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
               </div>
               {pdfModal && (
                 <PdfViewer
                   viewPdf={data?.prescription}
                   closeModal={() => setPdfModal(false)}
                 />
               )}
             </section>
           </div>
         </div>
       </div>
     );
}
export default AppointmentDetailModal