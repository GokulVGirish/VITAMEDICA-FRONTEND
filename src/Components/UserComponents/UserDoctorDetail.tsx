import vitamedica from "@/assets/logoVerified.png";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {toast} from "sonner"
import logo from '@/assets/cover1.jpg';
import { AxiosError } from "axios";
import instance from "../../Axios/axios";
import { Doctor } from "./UserDoctorsList";
import SlotBookingModal from "../extra/SlotBookingModal";
const UserDoctorDetail = () => {
    const {id}=useParams()
    const [doctor,setDoctor]=useState<Doctor|null>(null)
      const [modalOpen,setModalOpen]=useState(false)
    console.log("doctor",doctor)


    useEffect(()=>{

        const getDoctorDetail=async()=>{
            try{
                const response=await instance.get(`/doctors/${id}/profile`)
                
                if(response.data.success){
                  
                    setDoctor(response.data.doctor)

                }


            }
            catch(error){
               
                if(error instanceof AxiosError){
                    return toast.error(error.response?.data.message,{richColors:true,duration:1500})
                }else{
                    return toast.error("unknown error", {
                      richColors: true,
                      duration: 1500,
                    });

                }
                
            }
        }
        getDoctorDetail()


    },[])

    
  return (
    <main
      style={{ backgroundImage: `url(${logo})`, height: "50vh",backgroundSize:"cover",backgroundPosition:"center", }}
      className="profile-page pt-96"
    >
      <section className="relative block h-500-px">
        <div className="absolute bg-red-400  w-full h-full bg-center bg-cover">
          <span
            id="blackOverlay"
            className="w-full h-full absolute opacity-50 bg-black"
          ></span>
        </div>
        <div
          className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
          style={{ transform: "translateZ(0px)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <span className="text-blueGray-200 fill-current"></span>
          </svg>
        </div>
      </section>
      <section className="relative py-16 bg-blueGray-200">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
            <div className="px-6 rounded-lg shadow-md">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                  <div className=" mx-auto">
                    <img
                      alt="..."
                      src={
                        doctor?.image ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                      }
                      className="shadow-xl w-40 h-40 lg:w-32 lg:h-32 rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                  <div className="py-6 px-3 mt-32 sm:mt-0">
                    <button
                      onClick={() => setModalOpen(true)}
                      className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                      type="button"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-1">
                  {/* <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        22
                      </span>
                      <span className="text-sm text-blueGray-400">Friends</span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        10
                      </span>
                      <span className="text-sm text-blueGray-400">Photos</span>
                    </div>
                    <div className="lg:mr-4 p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
                        89
                      </span>
                      <span className="text-sm text-blueGray-400">
                        Comments
                      </span>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="text-center mt-12">
                <h3 className="text-4xl font-semibold leading-normal  text-blueGray-700 mb-2">
                  {doctor?.name}
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                  {doctor?.degree}
                </div>
                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                  {doctor?.department?.name}
                </div>
                <div className="mb-2 text-blueGray-600 mt-10">
                  <img className="h-20 mx-auto" src={vitamedica} />
                </div>
              </div>
              <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-9/12 px-4">
                    <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                      {doctor?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {modalOpen && (
        <SlotBookingModal
          id={id as string}
          closeModal={() => setModalOpen(false)}
        />
      )}
    </main>
  );
};
export default UserDoctorDetail;