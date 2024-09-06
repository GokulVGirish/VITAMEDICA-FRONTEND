
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import {toast} from "sonner"
import instance from "../../Axios/userInstance";
import { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";

import moment from "moment";
type PropsType={
    closeModal:()=>void
    id:string
}

const SlotBookingModal=({closeModal,id}:PropsType)=>{
    const [availbleDates,setAvailableDates]=useState<Date[]>([])
    const [selectedDate,setSelectedDate]=useState<Date|null>()
    const [slots,setSlots]=useState<any[]>([])
    const [timeSelected,setTimeSelected]=useState<{start:string}|null>(null)
    const navigate=useNavigate()
    const today=new Date()
    console.log("availabledates",availbleDates)
    console.log("id",id)
    console.log("slots",slots)
    console.log("selectedDate", moment(selectedDate).format("YYYY-MM-DD"));
    console.log("timeSelected",timeSelected?.start)

    useEffect(()=>{
        const getSlots=async()=>{
          try{
              const response = await instance.get(
                `/doctors/${id}/availability`
              );
              if (response.data.success) {
                console.log("dates", response.data.dates);
                const dates = response.data.dates.map(
                  (date: string) => new Date(date)
                );
                setAvailableDates(dates);
              }


          }
          catch(error){
            console.log(error)

          }

        }
        getSlots()
 



    },[])
    useEffect(()=>{
        const getTimeSlots=async()=>{
            try{
                const response = await instance.get(
                  `/doctors/${id}/slots?date=${selectedDate?.toISOString()}`
                );
                if(response.data.success){
                    console.log("dataa", response.data.slots);
                    const slots=response.data.slots.slots
                    setSlots(slots)
                }

            }
            catch(error){
                console.log(error)
            }
        }
       if(selectedDate){
         getTimeSlots();
       }

    },[selectedDate])
    const handleTimeSelect=(slot:any)=>{
        if (!slot.availability || slot.locked) {
          setTimeSelected(null);
          return toast.error("This Slot is reserved", {
            richColors: true,
            duration: 1500,
          });
        }
         const now = new Date(); // Current date and time

      
         const currentHours = now.getHours();
         const currentMinutes = now.getMinutes();
         const slotStart = new Date(slot.start);
         const slotStartHours = slotStart.getHours();
         const slotStartMinutes = slotStart.getMinutes();

      
         if (selectedDate && moment(selectedDate).isSame(today, "day")) {
    
           if (
             slotStartHours < currentHours ||
             (slotStartHours === currentHours &&
               slotStartMinutes <= currentMinutes)
           ) {
             setTimeSelected(null);
             return toast.error("This slot's time has already passed.", {
               richColors: true,
               duration: 1500,
             });
           }
         }
          if (!slot.availability || slot.locked) {
            setTimeSelected(null);
            return toast.error("This Slot is reserved", {
              richColors: true,
              duration: 1500,
            });
          }
      setTimeSelected(slot)

    }
    const handleBooking=()=>{
        if(!selectedDate || !timeSelected){
            return toast.error("Select a Date and Slot time",{richColors:true,duration:1500})
        }

           Swal.fire({
             title: "Proceed for booking?",
             text: "You won't be able to revert this!",
             icon: "warning",
             showCancelButton: true,
             confirmButtonText: "Yes, proceed!",
             cancelButtonText: "No, cancel",
           }).then((result) => {
             if (result.isConfirmed) {
               const bookingDetails = {
                 date: moment(selectedDate).format("YYYY-MM-DD"),
                 slotTime:timeSelected,

               };
               localStorage.setItem(
                 "bookingDetails",
                 JSON.stringify(bookingDetails)
               );
        
               navigate(`/payment/${id}`)

        
               console.log("OK button clicked");
             } else if (result.dismiss === Swal.DismissReason.cancel) {
        
               console.log("Cancel button clicked");
             }
           });
    }
 
   return (
     <div
       className="relative z-30"
       aria-labelledby="crop-image-dialog"
       role="dialog"
       aria-modal="true"
     >
       <div className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm"></div>
       <div className="fixed inset-0 z-10 flex items-center justify-center px-4 py-6">
         <div className="relative w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
           <div className="absolute top-2 right-2">
             <button
               type="button"
               className="text-gray-600 hover:text-gray-900 focus:outline-none"
               onClick={closeModal}
             >
               <FontAwesomeIcon icon={faCircleXmark} className="text-2xl" />
             </button>
           </div>

           <section className="flex flex-col gap-5  lg:flex-row bg-white rounded-lg p-6">
             <div className="flex justify-center lg:w-1/2">
               <div className="border border-gray-200 rounded-lg shadow-md p-6 bg-gray-50 w-full max-w-md">
                 <div className="flex flex-col justify-center h-full items-center">
                   <h2 className="text-lg font-semibold mb-4">Select Date</h2>
                   {availbleDates.length === 0 && (
                     <h2 className="text-red-500">No Available Slots</h2>
                   )}
                   <DatePicker
                     minDate={today}
                     onChange={(date) => setSelectedDate(date)}
                     includeDates={availbleDates}
                     inline
                   />
                 </div>
               </div>
             </div>

             <div className="lg:w-1/2 mt-6 lg:mt-0">
               <div className="border border-gray-200 rounded-lg shadow-md bg-gray-50 p-6">
                 <h3 className="text-lg font-semibold mb-4">Slot Timings</h3>
                 {slots.length === 0 && (
                   <h2 className="text-red-500 text-sm">Select a Date</h2>
                 )}
                 <div className="space-y-3">
                   {slots &&
                     slots.map((slot) => (
                       <label
                         key={slot._id}
                         className={`flex items-center p-3 rounded-lg cursor-pointer ${
                           slot.availability && !slot.locked
                             ? "bg-gray-100 hover:bg-indigo-100"
                             : "bg-red-400"
                         }`}
                       >
                         <input
                           type="radio"
                           onClick={() => handleTimeSelect(slot)}
                           name="time-slot"
                           className="mr-2"
                         />
                         <span>
                           {moment(slot.start).format("h:mm A")} -{" "}
                           {moment(slot.end).format("h:mm A")}
                         </span>
                       </label>
                     ))}
                 </div>
                 <div className="mt-6 flex justify-center">
                   <button
                     onClick={handleBooking}
                     className="py-2 px-8  bg-[#928EDE]  text-white rounded-lg hover:bg-[#706cbc]  transition"
                   >
                     Confirm
                   </button>
                 </div>
               </div>
             </div>
           </section>
         </div>
       </div>
     </div>
   );
}
export default SlotBookingModal