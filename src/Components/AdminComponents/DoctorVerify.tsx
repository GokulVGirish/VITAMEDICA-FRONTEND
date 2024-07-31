import adminInstance from "../../Axios/adminInstance";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "./UserListing";

const DoctorVerify = () => {
    const {id}=useParams()
    const [doctor,setDoctor]=useState<any>()
    const navigate=useNavigate()
     useEffect(()=>{
        const getDoctorDocs=async()=>{
            try{
                const response=await adminInstance.get(`/doctorDocument/${id}`)
                if(response.data.success){
                    console.log("data",response.data.doctor)
                    setDoctor(response.data.doctor);
                }

            }
            catch(error){
                if(error instanceof AxiosError){
                    console.log(error)
                }
            }
        }
        getDoctorDocs()

     },[])
      const handleImageClick = (imageUrl:string) => {
        if (imageUrl) {
          window.open(imageUrl, "_blank"); 
        }
      };
      const handleVerify=async()=>{
        try{

            const response = await adminInstance.put(`/verifyDoctor/${id}`);
            if(response.data.success){
                 toast.success("Doctor verified", {
                   position: "top-right",
                   autoClose: 5000,
                   hideProgressBar: false,
                   closeOnClick: true,
                   pauseOnHover: true,
                   draggable: true,
                   progress: undefined,
                   theme: "colored",
                   transition: Zoom,
                 });
                 setTimeout(()=>{
                    navigate("/admin")

                 },2000)

            }
        }
        catch(error){
            if(error instanceof AxiosError){
                console.log(error)
            }
        
      }
      }
      

    return (
      <section>
        <div className="container max-w-xl p-6 mx-auto space-y-12 lg:px-8 lg:max-w-7xl">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition={Zoom}
          />
          <div>
            <h2 className="text-3xl font-bold text-center sm:text-5xl">
              Documents
            </h2>
          </div>
          <div className="flex flex-col gap-7 justify-center lg:items-center">
            <div aria-hidden="true" className="mt-10 lg:mt-0">
              <img
                onClick={() =>
                  handleImageClick(doctor?.documents?.certificateImage)
                }
                width="600"
                height="600"
                src={
                  doctor?.documents?.certificateImage ||
                  "https://t3.ftcdn.net/jpg/05/14/75/82/360_F_514758236_i8rnB85PVdEaK19yGaK0TpaYEYMyxOL5.jpg"
                }
                className="mx-auto rounded-lg shadow-lg dark-bg-gray-500"
                alt="Feature representation"
                style={{ color: "transparent" }}
              />
            </div>
            <div aria-hidden="true" className="mt-10 lg:mt-0">
              <img
                width="600"
                height="600"
                onClick={() =>
                  handleImageClick(doctor?.documents?.qualificationImage)
                }
                src={
                  doctor?.documents?.qualificationImage ||
                  "https://t3.ftcdn.net/jpg/05/14/75/82/360_F_514758236_i8rnB85PVdEaK19yGaK0TpaYEYMyxOL5.jpg"
                }
                className="mx-auto rounded-lg shadow-lg dark-bg-gray-500"
                alt="Feature representation"
                style={{ color: "transparent" }}
              />
            </div>
            <div aria-hidden="true" className="mt-10 lg:mt-0">
              <img
                width="600"
                height="600"
                onClick={() =>
                  handleImageClick(doctor?.documents?.aadarFrontImage)
                }
                src={
                  doctor?.documents?.aadarFrontImage ||
                  "https://t3.ftcdn.net/jpg/05/14/75/82/360_F_514758236_i8rnB85PVdEaK19yGaK0TpaYEYMyxOL5.jpg"
                }
                className="mx-auto rounded-lg shadow-lg dark-bg-gray-500"
                alt="Feature representation"
                style={{ color: "transparent" }}
              />
            </div>
            <div aria-hidden="true" className="mt-10 lg:mt-0">
              <img
                width="600"
                height="600"
                onClick={() =>
                  handleImageClick(doctor?.documents?.aadarBackImage)
                }
                src={
                  doctor?.documents?.aadarBackImage ||
                  "https://t3.ftcdn.net/jpg/05/14/75/82/360_F_514758236_i8rnB85PVdEaK19yGaK0TpaYEYMyxOL5.jpg"
                }
                className="mx-auto rounded-lg shadow-lg dark-bg-gray-500"
                alt="Feature representation"
                style={{ color: "transparent" }}
              />
            </div>
            <button
              onClick={handleVerify}
              className={`mr-2 font-bold  bg-green-500 hover:bg-green-700 text-white py-4 px-16 rounded-full`}
            >
              Verify Doctor
            </button>
          </div>
        </div>
      </section>
    );
};
export default DoctorVerify;
