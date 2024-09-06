import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import instance from "../../Axios/doctorInstance";
import {toast} from "sonner"
import Swal from "sweetalert2";
import BookingCancellationReason from "../extra/CancellationReason";


interface PropsType {
  availableDates: Date[] 


}


const DoctorExistingSlots=({availableDates}:PropsType)=>{
    const [selectedSlotDate,setSelectedSlotDate]=useState<Date|null>()
      const [slots, setSlots] = useState<any[]>([]);
      const [selectedTimeSlot,setSelectedTimeSlot]=useState<{start:string,availability:boolean,_id:string}|null>(null)
      const date=new Date()
      const [cancellationReason, setCancellationReason] = useState("");
      const [cancellationReasonModel, setCancellationReasonModal] =useState(false);
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
                  setCancellationReasonModal(true)

                  


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
                        `/slots/unbooked`,
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
       const handleCancel = async () => {
         console.log("clicked");
         if (cancellationReason.trim() === "") {
           return toast.error("Enter a valid reason", {
             richColors: true,
             duration: 1500,
           });
         }
          const response = await instance.delete(
            `/slots/booked?date=${selectedSlotDate?.toISOString()}&startTime=${
              selectedTimeSlot?.start
            }`,
            { data: { reason: cancellationReason } }
          );
          if (response.data.success) {
            setCancellationReasonModal(false)
            setCancellationReason("")
            toast.success(response.data.message, {
              richColors: true,
              duration: 1500,
            });
            setSlots((prevState) =>
              prevState.filter((slot) => slot._id !== selectedTimeSlot?._id)
            );
          }
         
       };



    return (
      <div>
        <section className=" mt-4 flex items-center justify-center">
          <div className="flex flex-col lg:flex-row gap-12 w-full max-w-screen-lg bg-white shadow-lg rounded-lg p-8">
            <div className="lg:flex-1 flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold uppercase mb-6 text-gray-700">
                Added &nbsp; Slots
              </h2>
              <div className="w-full flex justify-center">
                <DatePicker
                  includeDates={availableDates}
                  minDate={date}
                  onChange={(date) => setSelectedSlotDate(date)}
                  inline
                  className="bg-white p-4 rounded-lg shadow-inner"
                />
              </div>
            </div>

         
            {selectedSlotDate && (
              <div className="lg:flex-1 flex flex-col justify-between bg-white p-6 rounded-lg shadow-sm">
                <div className="flex flex-col">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-700">
                    Available Slots
                  </h3>
                  <form className="space-y-4">
                    {slots &&
                      slots.map((slot: any) => (
                        <label
                          key={slot._id}
                          className={`flex items-center justify-between p-4 rounded-md transition duration-200 cursor-pointer ${
                            slot.availability
                              ? "bg-gray-100 hover:bg-indigo-100"
                              : "bg-red-400 text-white"
                          }`}
                        >
                          <input
                            type="radio"
                            onClick={() => setSelectedTimeSlot(slot)}
                            name="slot"
                            className="form-radio h-5 w-5"
                          />
                          <span className="text-base flex-1 pl-4">
                            {moment(slot.start).format("h:mm A")} -{" "}
                            {moment(slot.end).format("h:mm A")}
                          </span>
                        </label>
                      ))}
                  </form>
                </div>

           
                <div className="text-center mt-6">
                  <button
                    onClick={handleCancelTimeSlots}
                    className="py-2 px-10  bg-[#378eac] text-white rounded-lg shadow hover:bg-[#287892] transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {cancellationReasonModel && (
            <BookingCancellationReason
              handleCancel={handleCancel}
              cancellationReason={cancellationReason}
              setCancellationReasonModal={setCancellationReasonModal}
              setCancellationReason={setCancellationReason}
            />
          )}
        </section>
      </div>
    );
}
export default DoctorExistingSlots