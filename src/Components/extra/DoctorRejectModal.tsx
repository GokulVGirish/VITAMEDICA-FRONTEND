import { useState } from "react";
import {toast } from "sonner"
import adminInstance from "../../Axios/adminInstance";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
type PropsType={
    
    
closeModal:()=>void,
id:string

}

const DoctorRejectModal = ({closeModal,id}:PropsType) => {
    const [reason,setReason]=useState<string>("")
    const navigate=useNavigate()
    const handleReject=async()=>{
       
           if (!reason.trim()) {
          
              toast.error("Please enter a reason.");
              return;
            }

            if (reason.length < 10) {
           
              toast.error("Reason must be at least 10 characters long.");
              return;
            }
             try {
               const response = await adminInstance.delete(
                 `/doctors/${id}/reject`,{params:{reason}}
               );
               if (response.data.success) {
                toast.success(response.data.message,{richColors:true,duration:1500,onAutoClose:()=>{
                    closeModal()
                    navigate("/admin/verifyDoctor");
                }})
               }
             } catch (error) {
                if(error instanceof AxiosError){
                        
                  toast.error(error.response?.data.message);
                }else{
                      toast.error("An unknown error occured");

                }
             }
          
          



    }

  

  return (
    <div>
      <div
        id="hs-scale-animation-modal"
        className="fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-auto w-full h-full"
        role="dialog"
        aria-labelledby="hs-scale-animation-modal-label"
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full max-w-lg bg-white border shadow-sm rounded-xl">
            <div className="flex justify-between items-center py-3 px-4 border-b">
              <h3
                id="hs-scale-animation-modal-label"
                className="font-bold text-gray-800"
              >
                Reject Doctor
              </h3>
              <button
                type="button"
                className="inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
                aria-label="Close"
                onClick={closeModal}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-800">Reason for rejection</p>
              <input
                type="text"
                value={reason}
                onChange={(e)=>setReason(e.target.value)}
                className="flex mt-5 items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl shadow-lg"
                placeholder="enter a reason"
              />
            </div>
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRejectModal;