import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import moment, { Moment } from "moment";

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState<Moment>(moment());
  const [is24HourFormat, setIs24HourFormat] = useState<boolean>(false);


  useEffect(() => {
    const timer = setInterval(() => {
      setTime(moment());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTimeFormat = () => {
    setIs24HourFormat((prevFormat) => !prevFormat);
  };

  return (
    <div className="flex relative flex-col items-center justify-center w-full rounded-lg bg-gray-700 text-white p-4">
      <motion.div
        className="absolute top-0 left-0 w-20 h-20 bg-[#56aac6] rounded-full opacity-40"
        animate={{ y: [0, 20, -20, 0], x: [0, 20, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-32 h-32 bg-[#36778d] rounded-full opacity-30"
        animate={{ y: [0, -15, 15, 0], x: [0, -15, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
      
        className="bg-gray-700 p-4 rounded-lg text-center"
      >
        <div className="text-5xl font-extrabold tracking-tight">
          {is24HourFormat ? time.format("HH:mm") : time.format("hh:mm A")}
        </div>
        <div className="text-lg font-medium mt-2">
          {time.format("dddd, MMMM D, YYYY")}
        </div>

        <div className="mt-4">
          <button
            onClick={toggleTimeFormat}
            className="bg-[#56aac6] hover:bg-[#36778d] text-white font-semibold py-2 px-3 rounded-full shadow-lg transition-all duration-300"
          >
            {is24HourFormat ? "Switch To 12 Hour" : "Switch To 24 Hour"} Format
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DigitalClock;
