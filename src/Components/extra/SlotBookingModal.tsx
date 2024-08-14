
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import {toast} from "sonner"
import instance from "../../Axios/axios";
import { useEffect, useState } from "react";
import { json, useNavigate } from "react-router-dom";

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
            const response=await instance.get(`/doctors/${id}/availability`)
            if(response.data.success){
                console.log("dates",response.data.dates)
                const dates = response.data.dates.map((date:string) => new Date(date));
                setAvailableDates(dates);
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
               // Handle "OK" button click
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
               // Handle "Cancel" button click
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
       <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
       <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
         <div className="flex min-h-full justify-center px-2 py-12 text-center ">
           <div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-gray-400 text-slate-100 text-left shadow-xl transition-all">
             <div className="px-5 py-4">
               <button
                 type="button"
                 className="rounded-md p-1 inline-flex items-center justify-center text-gray-700 hover:bg-gray-700 focus:outline-none absolute top-2 right-2"
                 onClick={closeModal}
               >
                 <span className="sr-only">Close menu</span>
                 <FontAwesomeIcon onClick={closeModal} icon={faCircleXmark} />
               </button>
             </div>

             <section className="py-12 bg-white rounded-lg mx-10 my-10  text-gray-800 sm:py-24">
               <div className="mx-auto  flex max-w-md flex-col lg:justify-around rounded-lg lg:max-w-screen-xl lg:flex-row">
                
                 <div className="border rounded-lg border-gray-100 flex justify-center lg:justify-normal  shadow-gray-500/20 mt-8 mb-8 max-w-md bg-white shadow-sm sm:rounded-lg sm:shadow-lg lg:mt-0">
                   <form className="p-4  sm:p-8">
                     <div className="text-left mx-auto lg:mx-0 mt-4">
                       <h2 className="text-xl font-bold">Select Date</h2>
                       {availbleDates.length === 0 && (
                         <h2 className="text-red-500">No AvailableSlots</h2>
                       )}
                       <DatePicker
                       minDate={today}
                         onChange={(date) => setSelectedDate(date)}
                         includeDates={availbleDates}
                         inline
                       />
                     </div>
                   </form>
                 </div>

                 <div className="border rounded-lg border-gray-100 shadow-gray-500/20 mt-8 mb-8 max-w-md bg-white shadow-sm sm:rounded-lg sm:shadow-lg lg:mt-0">
                   <div className="relative border-b border-gray-300 p-4 py-8 sm:px-8">
                     <h3 className="mb-1 inline-block text-3xl font-medium">
                       <span className="mr-4">Slot Timings!</span>
                       {slots.length === 0 && (
                         <h2 className="text-red-500 text-sm">Select a Date</h2>
                       )}
                     </h3>
                   </div>
                   <form className="p-4 sm:p-8">
                     {/* <div className="mt-4 grid grid-cols-4 gap-2 lg:max-w-xl">
                       {slots &&
                         slots.map((slot, index) => (
                           <button
                             key={index}
                             className={`rounded-lg px-4 py-2 font-medium ${
                               true
                                 ? "bg-emerald-700 text-white"
                                 : "bg-emerald-100 text-emerald-900"
                             } active:scale-95    `}
                           >
                             {moment(slot.start).format("h:mm A")} -{" "}
                             {moment(slot.end).format("h:mm A")}
                           </button>
                         ))}
                     </div> */}
                     <div>
                       {slots &&
                         slots.map((slot) => {
                           return (
                             <label
                               key={slot._id}
                               className={`flex ${
                                 slot.availability&&!slot.locked
                                   ? "bg-gray-100"
                                   : "bg-red-400"
                               } bg-gray-100 text-gray-700 rounded-md px-3 py-2 my-3  hover:bg-indigo-300 cursor-pointer `}
                             >
                               <input
                                 type="radio"
                                 onClick={() =>
                                   handleTimeSelect(slot)
                                   
                                 }
                                 name="Country"
                               />
                               <i className="pl-2">
                                 {" "}
                                 {moment(slot.start).format("h:mm A")} -{" "}
                                 {moment(slot.end).format("h:mm A")}
                               </i>
                             </label>
                           );
                         })}
                     </div>
                   </form>
                   <div className="px-3 flex justify-center py-3">
                     <button
                       onClick={handleBooking}
                       className="py-2.5 px-6 rounded-lg text-sm font-medium text-white bg-[#928EDE]"
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
     </div>
   );
}
export default SlotBookingModal