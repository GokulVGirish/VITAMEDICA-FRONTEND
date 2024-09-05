

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
    <div className="flex flex-col items-center justify-center w-full rounded-lg bg-gray-700 text-white p-4">
      <div className="bg-gray-700 p-4 rounded-lg text-center">
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
      </div>
    </div>
  );
};

export default DigitalClock;
