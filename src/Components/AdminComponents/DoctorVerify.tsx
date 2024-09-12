import adminInstance from "../../Axios/adminInstance";
import { AxiosError } from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorRejectModal from "../extra/DoctorRejectModal";
import { toast } from "sonner";
import {motion} from "framer-motion"


const DoctorVerify = () => {
    const {id}=useParams()
    const [doctor,setDoctor]=useState<any>()
      const [isOpen, setIsOpen] = useState(false);
    const navigate=useNavigate()
    console.log("doctors",doctor)
     useEffect(()=>{
        const getDoctorDocs=async()=>{
            try{
                const response=await adminInstance.get(`/doctors/${id}/documents`)
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

            const response = await adminInstance.put(`/doctors/${id}/verify`);
            if(response.data.success){
                 toast.success("Doctor verified", {
                   richColors:true,
                   duration:1500
                 });
                 setTimeout(()=>{
                    navigate("/admin")

                 },2000)

            }
        }
        catch(error){
            if(error instanceof AxiosError){
              toast.error(error.response?.data.message,{richColors:true,duration:1500})
            }
        
      }
      }
    
      

    return (
      <section>
        <div className="container max-w-6xl p-8 mx-auto space-y-16 lg:px-10 lg:max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Verification Pending 
            </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto"
          >
            <motion.h3
              className="text-2xl font-semibold text-gray-800 mb-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Dr {doctor?.name?.split("")?.shift()?.toUpperCase()}
              {doctor?.name?.split("")?.slice(1)}
            </motion.h3>

            <motion.p
              className="text-sm text-gray-500 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              Department:&nbsp;
              <span className="font-medium text-gray-700">
                {doctor?.department
                  ?.map((department: any) => department?.name)
                  .join(", ")}
              </span>
            </motion.p>

            <motion.p
              className="text-sm text-gray-500 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              Email:&nbsp;
              <span className="font-medium text-gray-700">{doctor?.email}</span>
            </motion.p>

            <motion.p
              className="text-sm text-gray-500"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              Phone:&nbsp;
              <span className="font-medium text-gray-700">{doctor?.phone}</span>
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                src: doctor?.documents?.certificateImage,
                fallback:
                  "https://t3.ftcdn.net/jpg/05/14/75/82/360_F_514758236_i8rnB85PVdEaK19yGaK0TpaYEYMyxOL5.jpg",
                label: "Certificate",
                alt: "Certificate",
              },
              {
                src: doctor?.documents?.qualificationImage,
                fallback:
                  "https://t3.ftcdn.net/jpg/05/14/75/82/360_F_514758236_i8rnB85PVdEaK19yGaK0TpaYEYMyxOL5.jpg",
                label: "Qualification",
                alt: "Qualification",
              },
              {
                src: doctor?.documents?.aadarFrontImage,
                fallback:
                  "https://t3.ftcdn.net/jpg/05/14/75/82/360_F_514758236_i8rnB85PVdEaK19yGaK0TpaYEYMyxOL5.jpg",
                label: "Aadhar Front",
                alt: "Aadhar Front",
              },
              {
                src: doctor?.documents?.aadarBackImage,
                fallback:
                  "https://t3.ftcdn.net/jpg/05/14/75/82/360_F_514758236_i8rnB85PVdEaK19yGaK0TpaYEYMyxOL5.jpg",
                label: "Aadhar Back",
                alt: "Aadhar Back",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.img
                  onClick={() => handleImageClick(item.src)}
                  src={item.src || item.fallback}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                  alt={item.alt}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                />
                <motion.p
                  className="absolute bottom-3 left-3 text-sm font-medium text-white bg-black bg-opacity-50 px-3 py-1 rounded"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.3, duration: 0.5 }}
                >
                  {item.label}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex justify-center gap-6 mt-12">
            <button
              onClick={handleVerify}
              className="py-3 px-8 bg-green-600 hover:bg-green-700 text-white rounded-full text-lg font-semibold transition shadow-md transform hover:scale-105"
            >
              Verify Doctor
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="py-3 px-8 bg-red-600 hover:bg-red-700 text-white rounded-full text-lg font-semibold transition shadow-md transform hover:scale-105"
            >
              Reject Doctor
            </button>
          </div>

          {isOpen && (
            <DoctorRejectModal
              id={id as string}
              closeModal={() => setIsOpen(false)}
            />
          )}
        </div>
      </section>
    );
};
export default DoctorVerify;
