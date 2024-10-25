import  { useEffect, useRef, useState } from "react";
import moment from "moment";
import { toast } from "sonner";
import instance from "../../Axios/doctorInstance";
import AddedSlots from "./BookedSlots";
import WeekPicker from "./DatePicker";
import { AxiosError } from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";



const DoctorAddSlots = () => {
     const [dateRange, setDateRange] = useState<{
       start: Date | null;
       end: Date | null;
     }>({
       start: null,
       end: null,
     });
     const selectionRef = useRef<{
       resetSelection: () => void;
     }>(null);
       const handleDateRangeChange = (
         start: string | null,
         end: string | null
       ) => {
         setDateRange({ start :start? new Date(start):null, end:end?new Date(end):null });
     
       };
           console.log("Selected Date Range:", dateRange.start, dateRange.end); 
          


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slots, setSlots] = useState<{ start: Date; end: Date }[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
   console.log("slots", slots);
   console.log("available",availableDates)



  const isOverlapping = (newStart: Date, newEnd: Date, index: number) => {

    for (let i = 0; i < slots.length; i++) {
      if (i !== index) {
       
        const slot = slots[i];
        if (
          (newStart >= slot.start && newStart < slot.end) || 
          (newEnd > slot.start && newEnd <= slot.end) || 
          (newStart <= slot.start && newEnd >= slot.end) 
        ) {
          return true;
        }
      }
    }
    return false;
  };
  
  
  

  useEffect(() => {
    const getAvailableDates = async () => {
      const response = await instance.get("/slots/available-dates");
      if (response.data.success) {
        const dates = response.data.dates.map((date: string) => new Date(date));
        setAvailableDates(dates);
      }
    };
    getAvailableDates();
  }, []);



  const handleAddSlot = () => {
    if (!dateRange.start||!dateRange.end) {
      return toast.error("Select a date");
    }
    setSlots([
      ...slots,
      {
        start: new Date(
          !slots.length
            ?dateRange.start.setHours(9)
            : slots[slots.length - 1].end.getTime() + 30 * 60 * 1000
        ),
        end: new Date(
          !slots.length
            ? dateRange.start.setHours(10)
            : slots[slots.length - 1].end.getTime() + 90 * 60 * 1000
        ),
      },
    ]);
  };

  const addDatesInRange = (start:Date, end:Date) => {
    const dates:any = [];
    const totalDays =
        Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 3600 * 24)
        ) + 1;
    let currentDate = new Date(start);

  for (let i = 0; i < totalDays; i++) {
      currentDate.setDate(currentDate.getDate() + i);
      dates.push(new Date(currentDate));


  }

    return dates;
  };

  const handleSubmit = async () => {
    if (!dateRange.start ||!dateRange.end|| slots.length === 0) {
      return toast.error("Please select a date and at least one slot", {
        richColors: true,
        duration: 1500,
      });
    }

    const formattedSlots = slots.map((slot) => ({
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
    }));

    const data = {
      date: {start:dateRange.start.toISOString(),end:dateRange.end.toISOString()},
      slots: formattedSlots,
    };

    try {
      const response = await instance.post("/slots", data);
      if (response.data.success) {
          const newDates = addDatesInRange(dateRange.start, dateRange.end);
          console.log("new Dates",newDates)

          setAvailableDates((prevAvailableDates) => [
            ...prevAvailableDates,
            ...newDates,
          ]);
        if (selectionRef.current && "resetSelection" in selectionRef.current){
            selectionRef.current.resetSelection();
        }
          setDateRange({ start: null, end: null });
        setSlots([]);
        return toast.success("Successfully added Slots", {
          richColors: true,
          duration: 1500,
        });
      }
    } catch (error) {
      setSlots([])
      selectionRef.current?.resetSelection()
      setDateRange({start:null,end:null})
     
    if(error instanceof AxiosError){
        return toast.error(error.response?.data.message, {
          richColors: true,
          duration: 1500,
        });
    }
    }
  };

  return (
    <div className="w-screen max-w-screen-lg mx-auto p-6 lg:flex lg:space-x-14 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg shadow-2xl">
      <div className="w-full lg:w-2/3 space-y-10">
        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold text-[#364f6b] tracking-tight mb-2 border-b-2 border-gray-300 pb-2">
            Select Date & Time
          </h2>
          <button
            className="px-6 py-2 bg-[#364f6b]  text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            onClick={() => setIsModalOpen(true)}
          >
            View Existing Slots
          </button>
        </div>

        <div className="bg-white border-l-4 border-[#364f6b] p-6 rounded-lg shadow-lg space-y-4">
          <h3 className="text-lg font-bold text-gray-700">Choose Date</h3>
          <WeekPicker
            markedDates={availableDates.map((date) => date.toISOString())}
            ref={selectionRef}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>

        <div className="bg-white border-l-4 border-[#55a0b9] p-6 rounded-lg shadow-lg space-y-6">
          <h3 className="text-xl font-bold text-gray-800">Select Time Slots</h3>
          {slots.map((slot, index) => (
            <div key={index} className="flex items-center mt-4 space-x-4">
              <input
                type="time"
                className="w-1/3 p-2 border-2 rounded-lg bg-gray-50 text-center focus:bg-white shadow-md"
                value={moment(slot.start).format("HH:mm")}
                onChange={(e) => {
                  const newStart = new Date(slot.start);
                  newStart.setHours(
                    Number(e.target.value.split(":")[0]),
                    Number(e.target.value.split(":")[1])
                  );
                  const newEnd = new Date(slot.end);
                  if (newEnd <= newStart) {
                    return toast.error("End time must be after the start time");
                  }
                  if (isOverlapping(newStart, newEnd, index)) {
                    return toast.error(
                      "Slot overlaps with another existing slot"
                    );
                  }
                  const newSlots = [...slots];
                  newSlots[index] = { ...newSlots[index], start: newStart };
                  setSlots(newSlots);
                }}
              />
              <span className="text-lg font-medium text-gray-600">to</span>
              <input
                type="time"
                className="w-1/3 p-2 border-2 rounded-lg bg-gray-50 text-center focus:bg-white shadow-md"
                value={moment(slot.end).format("HH:mm")}
                onChange={(e) => {
                  const newEnd = new Date(slot.end);
                  newEnd.setHours(
                    Number(e.target.value.split(":")[0]),
                    Number(e.target.value.split(":")[1])
                  );
                  const newStart = new Date(slot.start);
                  if (newEnd <= newStart) {
                    return toast.error("End time must be after the start time");
                  }
                  if (isOverlapping(newStart, newEnd, index)) {
                    return toast.error(
                      "Slot overlaps with another existing slot"
                    );
                  }
                  const timeDifference =
                    (newEnd.getTime() - newStart.getTime()) / (1000 * 60);
                  if (timeDifference < 30) {
                    return toast.error(
                      "Consultation time must be at least 30 minutes"
                    );
                  }
                  const newSlots = [...slots];
                  newSlots[index] = { ...newSlots[index], end: newEnd };
                  setSlots(newSlots);
                }}
              />

              <FontAwesomeIcon
                onClick={() => setSlots(slots.filter((_, i) => i !== index))}
                className="text-gray-500 hover:text-red-600 cursor-pointer transition duration-200 ease-in-out transform hover:scale-110"
                icon={faTrash}
              />
            </div>
          ))}
          <button
            className="w-full bg-[#364f6b] text-white px-4 py-2 rounded-lg hover:bg-[#4a6079] transition-all shadow-lg transform hover:scale-105"
            onClick={handleAddSlot}
          >
            + Add Slot
          </button>
        </div>

        <button
          className="mt-10 w-full lg:w-56 bg-gradient-to-r from-[#55a0b9] to-[#4a6079] text-white px-4 py-2 rounded-lg shadow-xl hover:shadow-2xl transition-transform transform hover:scale-105 duration-300"
          onClick={handleSubmit}
        >
          Create Slots
        </button>
      </div>

      <div className="mt-10 lg:mt-0 w-full lg:w-1/3 space-y-6">
        <h3 className="text-2xl font-bold text-gray-700">
          Selected Time Slots
        </h3>
        <div className="space-y-4">
          {slots.length > 0 ? (
            slots.map((slot, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg shadow-md flex justify-between items-center"
              >
                <p className="text-gray-700 text-lg font-medium">
                  {moment(slot.start).format("hh:mm A")} -{" "}
                  {moment(slot.end).format("hh:mm A")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No slots selected yet.</p>
          )}
        </div>
        {isModalOpen && (
          <AddedSlots
            availableDates={availableDates}
            closeModal={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
export default DoctorAddSlots;
