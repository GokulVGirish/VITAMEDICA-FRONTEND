

import React from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import {toast} from "sonner"
import instance from "../../Axios/axios";
import { AxiosError } from "axios";

const PasswordReset = () => {
    const {search}=useLocation()
    const queryParams=new URLSearchParams(search)
    const token=queryParams.get("token")
    const [password,setPassword]=useState<string>("")
    const [cPassword,setCPassword]=useState<string>("")
    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault()
        console.log("inn")
           if (!password.trim()) {
             toast.error("Password is required",{richColors:true,duration:1500});
             return
           } else if (password.length < 6) {
        
                  return toast.error("Password must be at least 6 characters", {
                    richColors: true,
                    duration: 1500,
                  });

           } else if (!/\W/.test(password)) {
                  return toast.error("Password must contain at least one symbol", {
                    richColors: true,
                    duration: 1500,
                  });
           } else if (!/[A-Z]/.test(password)) {
            
                toast.error(
                  "Password must contain at least one uppercase letter",
                  {
                    richColors: true,
                    duration: 1500,
                  }
                );
                return
           }
            if (!cPassword.trim()) {
           
              return toast.error("Confirm Password is required", {
                richColors: true,
                duration: 1500,
              });
            } else if (password !== cPassword) {
              
              return toast.error("Passwords Must Match", {
                richColors: true,
                duration: 1500,
              });

            }
            console.log("done")

           try{
             const response = await instance.post(`/profile/password/reset/${token}`, {
               password,
             });
             if (response.data.success) {
               toast.success(response.data.message, {
                 richColors: true,
                 duration: 1500,
                 onAutoClose: () => {
                   window.close();
                 },
               });
             }

           }
           catch(error){
            if (error instanceof AxiosError) {
              toast.error(error?.response?.data.message, {
                richColors: true,
                duration: 1500,
                onAutoClose: () => {
                  window.close();
                },
              });
            } else {
              
              toast.error("An unexpected error occurred", {
                richColors: true,
                duration: 1500,
                onAutoClose:()=>{
                    window.close();

                }
              });
        
            }

           }

    }
  return (
    <main id="content" role="main" className="w-full max-w-md mx-auto p-6">
      <div className="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-indigo-300">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">
              Reset Your Password
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
             
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                <div>
                  <label
                 
                    className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    type="password"

                      name="password"
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                 
                      aria-describedby="email-error"
                    />
                  </div>
                  <label
                 
                    className="block text-sm font-bold ml-1 mb-2 mt-3 dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={cPassword}
                      onChange={(e)=>setCPassword(e.target.value)}
               
                      name="cpassword"
                      className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                 
                      aria-describedby="email-error"
                    />
                  </div>
                  <p
                    className="hidden text-xs text-red-600 mt-2"
                    id="email-error"
                  >
                    Please include a valid email address so we can get back to
                    you
                  </p>
                </div>
                <button
                  type="submit"
                  className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                >
                  Reset password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

     
    </main>
  );
};

export default PasswordReset;
