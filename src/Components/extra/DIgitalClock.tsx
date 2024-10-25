import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import moment, { Moment } from "moment";

const DigitalClock: React.FC = () => {
  const [time, setTime] = useState<Moment>(moment());
 

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(moment());
    }, 1000);
    return () => clearInterval(timer);
  }, []);



  return (
    <div className="relative flex  mt-[32rem] md:mt-10 flex-col items-center justify-center w-full rounded-lg bg-gray-700 text-white p-4 md:p-6 lg:p-8">
 
      <motion.div
        className="absolute top-0 left-0 bg-[#56aac6] rounded-full opacity-40"
        style={{ width: "4rem", height: "4rem" }}
        animate={{ y: [0, 20, -20, 0], x: [0, 20, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 bg-[#36778d] rounded-full opacity-30"
        style={{ width: "6rem", height: "6rem" }}
        animate={{ y: [0, -15, 15, 0], x: [0, -15, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      
     
      <motion.div className="bg-gray-700 p-4 md:p-6 lg:p-8 rounded-lg text-center">
        <div className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
          {time.format("hh:mm A")}
        </div>
        <div className="text-md md:text-lg lg:text-xl font-medium mt-2">
          {time.format("dddd, MMMM D, YYYY")}
        </div>
      </motion.div>
    </div>
  );


};

export default DigitalClock;
