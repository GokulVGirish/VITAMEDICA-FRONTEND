
import React, { useState } from "react";
import { toast } from "sonner";
import instance from "../../Axios/doctorInstance";
import { useNavigate } from "react-router-dom";

const PrescriptionModal = ({appointmentId,closeModal}:{appointmentId:string;closeModal:()=>void}) => {
   const [pdf, setPdf] = useState<File | null>(null);
  const navigate=useNavigate()
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
    
        toast.error("File size should be less than 2 MB", {
          richColors: true,
          duration: 1500,
        });
        setPdf(null);
        
      
      } else if (file.type !== "application/pdf") {
       

         toast.error("Please select a PDF file", {
           richColors: true,
           duration: 1500,
         });
        setPdf(null);

      } else {
        
        setPdf(file);
      }
    }
  };
  const handleFileUpload=async()=>{
     if (!pdf) {
       toast.error("No PDF file selected");
       return;
     }
     const formData=new FormData()
     formData.append("prescription",pdf)
    try{
        const response = await instance.put(`/appointment/${appointmentId}/prescriptions`,formData,{headers:{"Content-Type":"multipart/form-data"}});
        if(response.data.success){
            toast.success(response.data.message,{richColors:true,duration:1500,onAutoClose:()=>{
                closeModal()

                 navigate(`/doctor/userProfile/${appointmentId}`);
            }})
           
        }


    }
    catch(error){

    }
  }

  return (
    <div
      className="relative z-30"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center px-2 py-12 text-center ">
          <div className="bg-white p-3 rounded-lg">
            <div className="relative rounded-2xl bg-transparent text-slate-100 text-left  transition-all">
              <div className="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer">
                <input
                  id="upload2"
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                <label htmlFor="upload2" className="cursor-pointer">
                  {pdf ? (
                    <img
                      src={
                        "https://www.pcworld.com/wp-content/uploads/2024/02/pdf-icon.jpg?quality=50&strip=all"
                      }
                      className="max-h-48 rounded-lg mx-auto"
                      alt="Image preview"
                    />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-8 h-8 text-gray-700 mx-auto mb-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>
                      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                        Click to add prescription
                      </h5>
                      <p className="font-normal text-sm text-gray-400 md:px-6">
                        Choose the prescription pdf and it should be less than{" "}
                        <b className="text-gray-600">2mb</b>
                      </p>
                    </>
                  )}
                  <span
                    id="filename"
                    className="text-gray-500 bg-gray-200 z-50"
                  >
                    {pdf?.name}
                  </span>
                </label>
              </div>
            </div>
            <button
              onClick={handleFileUpload}
              className="py-3 my-8 px-2 text-lg bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white"
            >
              add Prescription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PrescriptionModal
