import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "sonner";
import instance from "../../Axios/doctorInstance";
import AddedSlots from "./BookedSlots";

const DoctorAddSlots = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slots, setSlots] = useState<{ start: Date; end: Date }[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const today = new Date().toISOString().split("T")[0];

  const isOverlapping = (newStart: Date, newEnd: Date, index: number) => {
    // Loop through all slots and check if any slot overlaps with the new slot being updated
    for (let i = 0; i < slots.length; i++) {
      if (i !== index) {
        // Skip the current slot being modified
        const slot = slots[i];
        if (
          (newStart >= slot.start && newStart < slot.end) || // newStart overlaps existing slot
          (newEnd > slot.start && newEnd <= slot.end) || // newEnd overlaps existing slot
          (newStart <= slot.start && newEnd >= slot.end) // new slot completely overlaps an existing one
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

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleAddSlot = () => {
    if (!selectedDate) {
      return toast.error("Select a date");
    }
    setSlots([
      ...slots,
      {
        start: new Date(
          !slots.length
            ? selectedDate.setHours(9)
            : slots[slots.length - 1].end.getTime() + 30 * 60 * 1000
        ),
        end: new Date(
          !slots.length
            ? selectedDate.setHours(10)
            : slots[slots.length - 1].end.getTime() + 90 * 60 * 1000
        ),
      },
    ]);
  };

  const handleSubmit = async () => {
    if (!selectedDate || slots.length === 0) {
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
      date: selectedDate.toISOString(),
      slots: formattedSlots,
    };

    try {
      const response = await instance.post("/slots", data);
      if (response.data.success) {
        setAvailableDates([...availableDates, selectedDate]);
        setSelectedDate(null);
        setSlots([]);
        return toast.success("Successfully added Slots", {
          richColors: true,
          duration: 1500,
        });
      }
    } catch (error) {
      return toast.error("An error occurred", {
        richColors: true,
        duration: 1500,
      });
    }
  };

  return (
    <div className="w-screen max-w-screen-lg mx-auto p-4 lg:flex lg:space-x-20">
      <div className="w-full lg:w-2/3">
        <p className="text-2xl font-bold text-gray-800 mb-4">
          Select Date & Time
        </p>

        <button
          className="px-6 py-2 bg-gradient-to-r bg-[#364f6b] text-white rounded-lg shadow hover:bg-[#556b84] transition-all duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          Existing Slots
        </button>

        <div className="mt-6">
          <input
            type="date"
            className="w-full p-3 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 border-gray-300 shadow-sm"
            value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
            min={today}
            onChange={handleStartDateChange}
          />
        </div>

        <div className="mt-8">
          <p className="text-xl font-bold text-gray-700">Select Time Slots</p>
          {slots.map((slot, index) => (
            <div key={index} className="flex items-center mt-4 space-x-2">
              <input
                type="time"
                className="p-2 border rounded-lg bg-gray-50 focus:bg-white shadow-md"
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

              <span className="text-gray-500">to</span>

              <input
                type="time"
                className="p-2 border rounded-lg bg-gray-50 focus:bg-white shadow-md"
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
              <button
                className="ml-2 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-400 transition-all shadow"
                onClick={() => setSlots(slots.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            className="mt-4 bg-[#364f6b] text-white px-4 py-2 rounded-lg hover:bg-[#4a6079] transition-all shadow-lg"
            onClick={handleAddSlot}
          >
            + Add Slot
          </button>
        </div>

        <button
          className="mt-8 w-full lg:w-56 bg-[#55a0b9] text-white px-4 py-2 rounded-md shadow-lg hover:bg-[#417e92] transition-all duration-300"
          onClick={handleSubmit}
        >
          Create Slots
        </button>
      </div>

      <div className="mt-10 lg:mt-0 w-full lg:w-1/3">
        <p className="text-xl font-bold text-gray-700 mb-4">
          Selected Time Slots
        </p>
        <div className="space-y-3">
          {slots.length > 0 ? (
            slots.map((slot, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl shadow-md flex justify-between items-center"
              >
                <p className="text-gray-600 text-lg font-medium">
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
