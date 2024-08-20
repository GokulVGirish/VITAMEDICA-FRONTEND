
import React, { useEffect, useMemo, useState } from "react";
import DoctorFilterSort from "./DoctorFilterSort";
import instance from "../../Axios/axios";
import { AxiosError } from "axios";
import {toast} from "sonner"
import logo from "@/assets/logoVerified.png";
import rating from "@/assets/rating.png";
import { useNavigate } from "react-router-dom";

export type Doctor={
    _id:string
    name:string,
    image:string,
    degree:string,
    fees:string,
    description:string
    department:{_id:string,name:string}
}

const DoctorsList = () => {

    const [doctors,setDoctors]=useState<Doctor[]|null>(null)
       const [currentPage, setCurrentPage] = useState(1);
       const [totalPages, setTotalPages] = useState(1);
    const navigate=useNavigate()
    console.log("current pages",currentPage,"totalpages",totalPages)
  


    useEffect(()=>{
      
        const getDoctors=async()=>{
            try{
                const response=await instance.get(`/doctors/list?page=${currentPage}&limit=6`)
                if(response.data.success){
                    console.log("data of doctor",response.data.doctors)
                    setDoctors(response.data.doctors);
                    setTotalPages(response.data.totalPages);
                }

            }
            catch(error){
                  if (error instanceof AxiosError) {
                    toast.error(error.response?.data.message, {
                      richColors: true,
                      duration: 1500,
                    });
                  } else {
                    toast.error("Unknown error", {
                      richColors: true,
                      duration: 1500,
                    });
                  }


            }

        }
        getDoctors()

    },[currentPage])

    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    const handlePreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
      }
    };
    const doctorDetails = useMemo(
      () =>doctors?.map((doctor) => {
          return (
            <div
              key={doctor._id}
              className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
            >
              <span>
                <img
                  onClick={() => navigate(`/doctorDetail/${doctor._id}`)}
                  src={
                    doctor.image ||
                    "https://static.vecteezy.com/system/resources/thumbnails/022/014/063/small_2x/missing-picture-page-for-website-design-or-mobile-app-design-no-image-available-icon-vector.jpg"
                  }
                  alt="Product"
                  className="h-70 w-58 object-cover rounded-t-xl"
                />
                <div className="px-4  justify-between py-3 w-72">
                  <p
                    onClick={() => navigate(`/doctorDetail/${doctor._id}`)}
                    className="text-3xl mt-3 text-center space-x-2 cursor-pointer font-bold text-black truncate block capitalize"
                  >
                    Dr {doctor.name}
                  </p>
                  <p
                    onClick={() => navigate(`/doctorDetail/${doctor._id}`)}
                    className="text-xs overflow-hidden mt-3 text-center space-x-2 font-bold text-black truncate block capitalize"
                  >
                    {doctor.degree}
                  </p>
                  <p className="text-sm text-gray-600 ml-8 w-44 pt-3 cursor-auto ">
                    <img src={logo} alt="none" />
                  </p>

                  <div className="flex justify-around   items-center">
                    <p className="text-lg text-center font-semibold text-black cursor-auto my-2">
                      {doctor.department.name}
                    </p>

                    <p
                      onClick={() => navigate(`/doctorDetail/${doctor._id}`)}
                      className="text-sm text-gray-600 cursor-auto ml-2"
                    >
                      <img src={rating} alt="none" className="h-28" />
                    </p>
                  </div>
                </div>
              </span>
            </div>
          );
        }),
      [doctors]
    );
    return (
      <div>
        <DoctorFilterSort />
        <section
          id="Projects"
          className="w-fit  mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-9"
        >
          {doctorDetails}
          
           
        </section>
        {/* pagenation */}
        <div className=" flex justify-center mb-10 ">
          <div className="flex justify-between items-center  gap-10">
            <button
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
              className="inline-flex items-center border border-indigo-300 px-3 py-1.5 rounded-md text-indigo-500 hover:bg-indigo-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              <span className="ml-1 font-bold text-lg">Back</span>
            </button>
            <h1 className=" text-indigo-500 font-bold">
              {currentPage} / {totalPages}
            </h1>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="inline-flex items-center border border-indigo-300 px-3 py-1.5 rounded-md text-indigo-500 hover:bg-indigo-50"
            >
              <span className="mr-1 font-bold text-lg">Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );

}

export default DoctorsList