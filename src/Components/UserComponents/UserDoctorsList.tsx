
import React, { useEffect, useState } from "react";
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
    const navigate=useNavigate()
  


    useEffect(()=>{
      
        const getDoctors=async()=>{
            try{
                const response=await instance.get("/doctor-list")
                if(response.data.success){
                    console.log("data of doctor",response.data.doctors)
                    setDoctors(response.data.doctors);
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

    },[])
    return (
      <div>
        <DoctorFilterSort />
        <section id="Projects"
    className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">

{
    doctors && doctors.map((doctor)=>{
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
                  className="text-3xl mt-3 text-center space-x-2 font-bold text-black truncate block capitalize"
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
    })
}
    </section>

      </div>
    );

}

export default DoctorsList