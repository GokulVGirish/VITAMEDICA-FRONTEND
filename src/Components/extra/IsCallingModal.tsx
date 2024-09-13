import { useEffect, useState } from "react";

const IsCallingModal = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 4 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-10 right-10 w-80 h-28 p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow-2xl transform scale-105 hover:scale-110 transition-transform duration-300 ease-in-out">
      <div className="flex items-center mt-1 justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-white text-blue-500 flex items-center justify-center font-bold text-lg animate-pulse mr-4">
            📞
          </div>
          <p className="text-2xl font-semibold">Calling Patient{dots}</p>
        </div>
      </div>
    </div>
  );
};
export default IsCallingModal;
