import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import instance from "../../Axios/doctorInstance";
import {toast} from "sonner"
import Swal from "sweetalert2";

interface PropsType {
  availableDates: Date[] 


}


const DoctorExistingSlots=({availableDates}:PropsType)=>{
    const [selectedSlotDate,setSelectedSlotDate]=useState<Date|null>()
      const [slots, setSlots] = useState<any[]>([]);
      const [selectedTimeSlot,setSelectedTimeSlot]=useState<{start:string,availability:boolean,_id:string}|null>(null)
      const date=new Date()
      console.log("slots",slots)
      console.log("selecteddate",selectedSlotDate)
      useEffect(()=>{

        const getAvailableTimes=async()=>{
            const response=await instance.get(`/slots?date=${selectedSlotDate?.toISOString()}`)
            if(response.data.success){
                  const slots = response.data.slots.slots;
                  setSlots(slots)
                
            }


        }
        if(selectedSlotDate){
            getAvailableTimes()
        }

      },[selectedSlotDate])
      const handleCancelTimeSlots=()=>{
         if (!selectedSlotDate || !selectedTimeSlot) {
           return toast.error("Select a Date and Slot time", {
             richColors: true,
             duration: 1500,
           });
         }
         if(!selectedTimeSlot.availability){
             Swal.fire({
               title: "This slot has been booked and money will be debited from Your wallet?",
               text: "You won't be able to revert this!",
               icon: "warning",
               showCancelButton: true,
               confirmButtonText: "Yes, proceed!",
               cancelButtonText: "No, cancel",
             }).then(async(result)=>{
                if(result.isConfirmed){
                    const response = await instance.delete(
                      `/cancelBookedSlots?date=${selectedSlotDate.toISOString()}&startTime=${selectedTimeSlot.start}`
                    );
                    if(response.data.success){
                         toast.success(response.data.message, {
                           richColors: true,
                           duration: 1500,
                         });
                         setSlots((prevState) =>
                           prevState.filter(
                             (slot) => slot._id !== selectedTimeSlot._id
                           )
                         );

                    }

                  


                }

             })

         }else{
              Swal.fire({
                title:
                  "Would you like to delete this slot?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, proceed!",
                cancelButtonText: "No, cancel",
              }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                      const response = await instance.delete(
                        `/cancelUnbookedSlots`,
                        {
                          params: {
                            date: selectedSlotDate.toISOString(),
                            startTime: selectedTimeSlot.start,
                          },
                        }
                      );
                   if(response.data.success){
                    toast.success(response.data.message, {
                      richColors: true,
                      duration: 1500,
                    });
                    setSlots((prevState)=>prevState.filter((slot)=>slot._id!==selectedTimeSlot._id))

                   }
                    } catch (error) {
                     
                    }



                }
              });

         }

      }



    return (
      <div>
        <section className=" bg-white rounded-lg mx-10 my-10  text-gray-800 sm:py-24">
          <div className="mx-auto  flex max-w-md flex-col  lg:justify-around rounded-lg lg:max-w-screen-xl lg:flex-row">
            <div className="border rounded-lg h-[400px] border-gray-100 flex justify-center lg:justify-normal  shadow-gray-500/20 mt-8 mb-8 max-w-md bg-white shadow-sm sm:rounded-lg sm:shadow-lg lg:mt-0">
              <form className="p-4  sm:p-8">
                <div className="text-left mx-auto lg:mx-0 mt-4">
                  <h2 className="text-xl font-bold">Select Date</h2>
                  {/* {availbleDates.length === 0 && (
                    <h2 className="text-red-500">No AvailableSlots</h2>
                  )} */}
                  <DatePicker
                    includeDates={availableDates}
                    minDate={date}
                    onChange={(date) => setSelectedSlotDate(date)}
                    inline
                  />
                </div>
              </form>
            </div>

            <div className="border rounded-lg border-gray-100 shadow-gray-500/20 mt-8 mb-8 max-w-md bg-white shadow-sm sm:rounded-lg sm:shadow-lg lg:mt-0">
              <div className="relative border-b border-gray-300 p-4 py-8 sm:px-8">
                <h3 className="mb-1 inline-block text-3xl font-medium">
                  <span className="mr-4">Slot Timings!</span>
                  {/* {slots.length === 0 && (
                    <h2 className="text-red-500 text-sm">Select a Date</h2>
                  )} */}
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
                    slots.map((slot: any) => {
                      return (
                        <label
                          key={slot._id}
                          className={`flex ${
                            slot.availability ? "bg-gray-100" : "bg-red-400"
                          } bg-gray-100 text-gray-700 rounded-md px-3 py-2 my-3  hover:bg-indigo-300 cursor-pointer `}
                        >
                          <input
                            type="radio"
                            onClick={() => setSelectedTimeSlot(slot)}
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
                {selectedSlotDate && (
                  <button
                    onClick={handleCancelTimeSlots}
                    className="py-2.5 px-6 rounded-lg text-sm font-medium text-white bg-[#928EDE]"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
}
export default DoctorExistingSlots