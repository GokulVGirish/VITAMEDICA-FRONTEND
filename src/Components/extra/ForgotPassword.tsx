import React, { useState } from 'react';
import { FaEnvelope} from 'react-icons/fa';
import { motion } from 'framer-motion';
import logo from "@/assets/logo1.png";
import {toast} from "sonner"
import { useParams,useNavigate } from 'react-router-dom';
import instance from '../../Axios/axios';
import docInstance from '../../Axios/doctorInstance';
import { AxiosError } from 'axios';
import Spinner from './Spinner';






const ForgotPassword=()=>{
   const [email, setEmail] = useState<string>("");
   const [errors, setErrors] = useState<{email?:string}>({});
   const { request } = useParams();
   const navigate=useNavigate()
   const [loading,setLoading]=useState(false)

  



   
   const handleSubmit = async(e:React.FormEvent) => {
    e.preventDefault()
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return toast.error("Invalid Email", {
          richColors: true,
          duration: 1500,
        });
      }
      setLoading(true)
      let response;
     try{
         if (request === "user") {
           response = await instance.post("/profile/password/reset-request", {
             email,
           });
         } else {
           response = await docInstance.post(
             "/profile/password/reset-request",
             {
               email,
             }
           );
         }
         if(response.data.success){
            setLoading(false)
             toast.success("A Password Reset Link was Sucessfully Sent", {
              richColors: true,
              duration: 1500,
              onAutoClose:()=>{
                request==="user"?navigate("/login"):navigate("/doctor/login")
              }
            });
         }

     }
     catch(error){
        setLoading(false)
        if(error instanceof AxiosError){
            
          return toast.error(error.response?.data.message, {
            richColors: true,
            duration: 1500,
          });
        }

     }
     
   };

   return (
     <div className="flex items-center justify-center w-full">
       <div className="flex flex-col md:flex-row min-h-screen w-full bg-gray-100">
         <div className="w-full  flex flex-col justify-center items-center p-8">
           <motion.div
             initial={{ opacity: 0, y: -50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             className="w-full max-w-md"
           >
             <img
               src={logo}
               alt="Logo"
               className="mb-8 mx-auto rounded-lg shadow-lg"
             />
             <h1 className="text-3xl font-bold text-center mb-6">
               Recover Password
             </h1>
             <p className="text-gray-600 text-center mb-8">
               Enter your email and create a new password to recover your
               account.
             </p>
             <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                 <label
                   htmlFor="email"
                   className="block text-sm font-medium text-gray-700 mb-1"
                 >
                   Email Address
                 </label>
                 <div className="relative">
                   <input
                     type="text"
                     className={`w-full px-4 py-2 border rounded-md pl-10 ${
                       errors.email ? "border-red-500" : "border-gray-300"
                     }`}
                     placeholder="Enter your email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                   />
                   <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                 </div>
                 {errors.email && (
                   <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                 )}
               </div>
               {loading && <Spinner />}

               <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 type="submit"
                 className={`w-full ${
                   request === "user"
                     ? "bg-[#928EDE]" + " " + "hover:bg-[#7e79d5]"
                     : "bg-black" + " " + "hover:bg-[#7e79d5]"
                 } text-white py-2 px-4 rounded-md transition duration-300`}
               >
                 Reset Password
               </motion.button>
             </form>
           </motion.div>
         </div>
       </div>
     </div>
   );
}
export default ForgotPassword