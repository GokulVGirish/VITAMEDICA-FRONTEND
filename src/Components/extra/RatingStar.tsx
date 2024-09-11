import React, { useState } from "react";
import {toast} from "sonner"
import instance from "../../Axios/userInstance";
import { useNavigate } from "react-router-dom";

const  StarRatingComponent=({closeRating,appointmentId,docId}:{closeRating:()=>void;appointmentId:string;docId:string})=> {
 const [rating, setRating] = useState(0);
 const [description,setDescription]=useState<string>("")
 const navigate=useNavigate()


 const handleRating = async() => {

 if(rating==0){
    return toast.error("Please select a rating",{richColors:true,duration:1500})
 }
try{
     const response = await instance.put(`/appointments/${appointmentId}/review`,{docId,rating,description})
     if(response.data.success){

        toast.success("Review Added Sucessfully", {
          richColors: true,
          duration: 1500,
          onAutoClose:()=>{
            navigate(`/profile/appointmentDetail/${appointmentId}`);
          }
        });

     }

}catch(error){

}


   
 };

 return (
   <div
     className="relative z-30"
     aria-labelledby="crop-image-dialog"
     role="dialog"
     aria-modal="true"
   >
     <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
     <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
       <div className="flex min-h-full justify-center px-2 py-12 text-center ">
         <div className="relative rounded-2xl bg-transparent text-slate-100 text-left  transition-all">
           <div className="px-5 py-4">
            
           </div>

           <div className="py-3 sm:max-w-xl sm:mx-auto">
             <div className="bg-white min-w-1xl flex flex-col rounded-xl shadow-lg">
               <div className="px-12 py-5">
                 <h2 className="text-gray-800 text-3xl font-semibold">
                   Your opinion matters to us!
                 </h2>
               </div>
               <div className="bg-gray-200 w-full flex flex-col items-center">
                 <div className="flex flex-col items-center py-6 space-y-3">
                   <span className="text-lg text-gray-800">
                     Rate and share your experience
                   </span>
                   <div className="flex space-x-3">
                     {[1, 2, 3, 4, 5].map((value) => (
                       <svg
                         key={value}
                         onClick={() => setRating(value)} 
                         className={`w-12 h-12 ${
                           value <= rating ? "text-yellow-500" : "text-gray-500"
                         }`}
                         xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 20 20"
                         fill="currentColor"
                         style={{ cursor: "pointer" }}
                       >
                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                       </svg>
                     ))}
                   </div>
                 </div>
                 <div className="w-3/4 flex flex-col">
                   <textarea
                   onChange={(e)=>setDescription(e.target.value)}
                   placeholder="Tell about your experience"
                     rows={3}
                     className="p-4 text-gray-500 rounded-xl resize-none"
                   >
                     
                   </textarea>
                   <button onClick={handleRating} className="py-3 my-8 text-lg bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white">
                     Rate now
                   </button>
                 </div>
               </div>
               <div className="h-20 flex items-center justify-center">
                 <span  className="text-gray-600 cursor-pointer" onClick={closeRating}>
                   Maybe later
                 </span>
               </div>

               
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}
export default StarRatingComponent
