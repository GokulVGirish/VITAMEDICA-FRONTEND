
import React, { useEffect, useState } from "react";
import moment from "moment"
import {toast} from "sonner"
import instance from "../../Axios/doctorInstance";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import DoctorExistingSlots from "./DoctorExistingSlots";

const DoctorAddSlots = () => {
  const [selectStartDate, setSelectStartDate] = useState<Date|null>();

  const [selectedSlots,setSelectedSlots]=useState<{ start: Date; end: Date }[]>([])
    const today = new Date().toISOString().split("T")[0]; 

  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  console.log('availabledates',availableDates)

  useEffect(()=>{
    const getAvailableDates=async()=>{

      const response = await instance.get("/slots/available-dates");
      if(response.data.success){
           const dates = response.data.dates.map(
             (date: string) => new Date(date)
           );
           setAvailableDates(dates);

      }

    }
    getAvailableDates()
  },[])

   
     const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedSlots([])
       const date = new Date(e.target.value);
       setSelectStartDate(date);
     };
     const navigate=useNavigate()
       console.log("selected", selectStartDate);

   
       const timeSlots: { start: Date; end: Date }[] = [];
         const timeNow = new Date();

       const startTime = new Date();
       startTime.setHours(9, 0, 0, 0);
       const endTime = new Date();
       endTime.setHours(18, 0, 0, 0);

       let currentTime = startTime;
       while (currentTime < endTime) {
         const slotStart = new Date(currentTime);
         const slotEnd = new Date(currentTime);
         slotEnd.setMinutes(slotStart.getMinutes() + 60); 

         if (slotEnd <= endTime) {
           timeSlots.push({ start: slotStart, end: slotEnd });
         }

         currentTime = new Date(slotEnd);
         currentTime.setMinutes(currentTime.getMinutes() + 15); 
       }
         const handleSlotClick = (slot: { start: Date; end: Date }) => {
            if(!selectStartDate){
                return toast.error("Select a date", {
                  richColors: true,
                  duration: 1500,
                });

            }
            const selectedDate = selectStartDate.toISOString().split("T")[0];
               if (selectedDate === today && slot.start <= timeNow) {
                 return toast.error("The time has passed to add this slot", {
                   richColors: true,
                   duration: 1500,
                 });
               }
            setSelectedSlots((prevState)=>{
                const isSelected=prevState.some(s=>s.start.getTime()===slot.start.getTime() &&s.end.getTime()===slot.end.getTime())
                 if (isSelected) {
                    return prevState.filter(s=>s.start.getTime()!==slot.start.getTime()||s.end.getTime()!==slot.end.getTime())

                 }else{
                    return [...prevState,slot]
                 }

            })
           
         };
         console.log("selected time",selectedSlots)




  const handleSubmit = async() => {
    if(!selectStartDate||selectedSlots.length===0){
     return toast.error("Please select a date and at least one slot", {
       richColors: true,
       duration: 1500,
     });
    }
    const formattedSlots=selectedSlots.map(slot=>({start:slot.start.toISOString(),end:slot.end.toISOString()}))
    const data={
      date:selectStartDate.toISOString(),
      slots:formattedSlots
    }
   try{
     const response = await instance.post("/slots", data);
     if (response.data.success) {
      setAvailableDates([...availableDates,selectStartDate])
         setSelectStartDate(null);
         setSelectedSlots([])
       return toast.success("Sucessfully added Slots", {
         richColors: true,
         duration: 1500,
       });
    
     }
  

   }
   catch(error){
    if(error instanceof AxiosError){
      toast.error(error.response?.data.message, {
        richColors: true,
        duration: 1500,
      });
    }else{
      toast.error("Unknown error", {
        richColors: true,
        duration: 1500,
      });

    }

    
   }
   
  };

  return (
    <>
      <div>
        <div className="w-screen">
          <div className="mx-auto grid max-w-screen-lg ">
            <div>
              <p className="mt-8 font-serif  text-xl font-bold text-gray-700">
                Select Date
              </p>

              <div className="relative mt-4 w-56">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  type="date"
                  className="block w-full rounded-lg border border-[#0e8e93] bg-[#96d2e6] p-2.5 pl-10 text-gray-900 font-medium outline-none ring-opacity-30 placeholder:text-emerald-800 focus:ring focus:ring-emerald-300 sm:text-sm"
                  placeholder="Select date"
                  value={
                    selectStartDate
                      ? selectStartDate.toISOString().split("T")[0]
                      : ""
                  }
                  min={today}
                  onChange={handleStartDateChange}
                />
              </div>
            </div>

            <div>
              <p className="mt-8 font-serif text-xl font-bold text-gray-700">
                Select a time
              </p>
              <div className="mt-4 grid grid-cols-4 gap-2 lg:max-w-xl">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`rounded-lg px-4 border border-[#0e8e93] py-2 font-medium ${
                      selectedSlots.some(
                        (s) =>
                          s.start.getTime() === slot.start.getTime() &&
                          s.end.getTime() === slot.end.getTime()
                      )
                        ? "bg-[#378eac] text-gray-1000"
                        : "bg-[#96d2e6] text-gray-900"
                    } active:scale-95`}
                    onClick={() => handleSlotClick(slot)}
                  >
                    {moment(slot.start).format("h:mm A")} -{" "}
                    {moment(slot.end).format("h:mm A")}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="mt-8 w-56 rounded-lg   bg-[#378eac] px-1 py-2 text-md font-bold text-white transition hover:translate-y-1"
              onClick={handleSubmit}
            >
              Create Slots
            </button>
          </div>
        </div>
      </div>
      <DoctorExistingSlots availableDates={availableDates} />
    </>
  );
};

export default DoctorAddSlots;
