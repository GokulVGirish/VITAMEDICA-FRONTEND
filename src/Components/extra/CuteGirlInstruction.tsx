

import cutegirl from "@/assets/cuteGirl.png";
import userSideMessage from "@/assets/messageUserSide.png";
import hiMessage from "@/assets/hiMessage.png";
import doctorSideMessage from "@/assets/messageDoctorSide.png";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const InstructionModal = ({role}:{role:string}) => {
   const [showMessage, setShowMessage] = useState(false);
   const [showHiMessage,setShowHiMessage]=useState(false)

   useEffect(() => {
    
     const timer = setTimeout(() => {
     setShowHiMessage(true)
     }, 1200);
    const timer2 = setTimeout(() => {
    setShowHiMessage(false)
     setShowMessage(true)
    }, 2500);

     return () => {
        clearTimeout(timer);
        clearTimeout(timer2)
     }
   }, []);

   return (
     <div
       className="relative z-30"
       aria-labelledby="video-permission-dialog"
       role="dialog"
       aria-modal="true"
     >
       <div className="fixed inset-0 bg-gray-900 bg-opacity-35 pointer-events-none"></div>

       <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
         <motion.div
           className="absolute top-72 left-72 pointer-events-auto"
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
         >
           <img
             className="rounded-2xl h-96"
             src={cutegirl}
             alt="Cute girl cartoon"
           />
         </motion.div>

         {showHiMessage && (
           <motion.img
             className="h-60 absolute top-44 left-16 pointer-events-auto"
             src={hiMessage}
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
           />
         )}

         {showMessage && (
           <motion.img
             className="h-60 absolute top-44 left-16 pointer-events-auto"
             src={role === "user" ? userSideMessage : doctorSideMessage}
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
           />
         )}
       </div>
     </div>
   );
};
export default InstructionModal