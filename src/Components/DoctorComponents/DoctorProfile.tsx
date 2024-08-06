import { useEffect,useRef,useState } from "react";
import { FaEdit } from "react-icons/fa";
import instance from "../../Axios/doctorInstance";
import { AxiosError } from "axios";
import ProfileModal from "../extra/ProfileModal";
import SyncLoader from "react-spinners/SyncLoader";
import "react-image-crop/dist/ReactCrop.css";
import {toast} from "sonner"
export type Doctor ={
    _id:string
  name: string;
  email: string;
  phone: string;
  gender: string;
  department: string;
  password: string;
  description:string|null
  image:string|null
  documentsUploaded?: boolean;
  documents?: {
    certificateImage: string | null;
    qualificationImage: string | null;
    aadarFrontImage: string | null;
    aadarBackImage: string | null;
    yearsOfExperience: number | null;
  } | null;
  isBlocked?: boolean;
  status?: "Pending" | "Submitted" | "Verified";
  fees:string|null;
  degree:string|null
}
const DoctorProfile = () => {
    const [userData, setUserData] = useState<Doctor>({
      _id: "",
      name: "",
      email: "",
      phone: "",
      gender: "",
      department: "",
      password: "",
      image:"",
      description:"",
      fees:"",
      degree:""
    });
    const inputRef = useRef<HTMLInputElement>(null);
      const [imageURL, setImageURL] = useState<string>();
      const [image, setImage] = useState<File>();
       const [myErrors, setMyErrors] = useState<any>({});
       const [modalOpen,setModalOpen]=useState(false)
       const [loading,setLoading]=useState(false)
        const override = {
          display: "flex",
          justifyContent: "center",
        };

    useEffect(()=>{

        const getProfile=async()=>{
           try{

             const response = await instance.get("/profile");
             if(response.data.success){
                setUserData(response.data.doctorData)
                setImageURL(response.data.doctorData.image||"");
                console.log("data",response.data.doctorData);

             }

           }
           catch(error){
            if(error instanceof AxiosError){
                console.log(error)
            }
           }

        }
        getProfile()


    },[])
    const handleSubmit=async(e:React.FormEvent)=>{
        setMyErrors({})
        e.preventDefault()
        const validationErrors:any={}
         const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
         if (!userData.name.trim()) {
           validationErrors.name = "Name is required";
         } else if (!nameRegex.test(userData.name)) {
           validationErrors.name = "Invalid name format";
         }
         const phoneRegex = /^\d{10}$/;
         if (!userData.phone || !userData.phone.trim()) {
           validationErrors.phone = "Phone number is required";
         } else if (!phoneRegex.test(userData.phone)) {
           validationErrors.phone = "Phone number must be 10 digits";
         }
         if(!userData.degree?.trim()){
          return toast.error("Degree Field Is Missing",{richColors:true,duration:1500})
         }
          
         

  if (userData.fees == null || (userData?.fees as String).trim() === "") {
   return toast.error("Fees are required", {
     richColors: true,
     duration: 1500,
   });
  } else if (isNaN(Number(userData.fees))) {
  
              return toast.error("Fees must be a number", {
                richColors: true,
                duration: 1500,
              });
  } else {
    const feesNumber = Number(userData.fees);
    if (feesNumber < 300 || feesNumber > 3000) {
      validationErrors.fees = "Fees should be between 300 and 3000";
      return toast.error("Fees should be between 300 and 3000", {
        richColors: true,
        duration: 1500,
      });
    }
    }
  


           if(Object.keys(validationErrors).length>0){
            setMyErrors(validationErrors)
            return
           }
          try{
            setLoading(true)
             const response = await instance.put("/profileUpdate",userData);
             setLoading(false)
             if (response.data.success) {
               toast.success(response.data.message, {
                 richColors: true,
                 duration: 1500,
               });
             }

          }
          catch(error){
            if(error instanceof AxiosError){
              toast.error(error.response?.data.message, {
                richColors: true,
                duration: 1500,
              });
            }

          }

          


    }
  return (
    <>
      <div className="flex items-center mt-36 justify-center p-12 h-full  mb-40">
        <div className="mx-auto w-full  max-w-[550px] bg-gray-100">
          <div className="w-full relative flex justify-center pt-10 ">
            <img
              className="h-40 w-40  rounded-full border-4 border-white dark:border-[#05acb4] mx-auto my-4"
              src={
                imageURL ||
                "https://img.freepik.com/premium-vector/gray-color-user-icon-vector-illustration_276184-162.jpg"
              }
              alt=""
            />

            <FaEdit
              onClick={() => setModalOpen(true)}
              className="absolute top-44 h-8 w-6 right-48 cursor-pointer"
            />
          </div>
          <div className="w-full flex justify-center">
            {myErrors?.image && (
              <span className="text-red-500 text-center text-xs">
                {myErrors.image}
              </span>
            )}
          </div>
          <div className="w-full flex justify-center"></div>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="name"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={userData?.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                placeholder="Full Name"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#05acb4] focus:shadow-md"
              />
              {myErrors?.name && (
                <span className="text-red-500 text-center text-xs">
                  {myErrors.name}
                </span>
              )}
            </div>
            <div className="mb-5">
              <label
                htmlFor="phone"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
                id="phone"
                placeholder="Enter your phone number"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#05acb4] focus:shadow-md"
              />
              {myErrors?.phone && (
                <span className="text-red-500 text-center text-xs">
                  {myErrors.phone}
                </span>
              )}
            </div>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  placeholder="Enter your email"
                  readOnly
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#05acb4] focus:shadow-md"
                />
              </div>
            </div>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                password
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userData.password}
                  name="password"
                  placeholder="Enter your password"
                  readOnly
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#05acb4] focus:shadow-md"
                />
                <FaEdit className="absolute top-4 right-4 cursor-pointer" />
              </div>
            </div>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Degree
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userData.degree || ""}
                  name="degree"
                  onChange={(e) =>
                    setUserData({ ...userData, degree: e.target.value })
                  }
                  placeholder="Enter your Degree"
                 
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#05acb4] focus:shadow-md"
                />
              </div>
            </div>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Fees
              </label>
              <div className="relative">
                <input
                  type="text"
                  onChange={(e) =>
                    setUserData({ ...userData, fees: e.target.value })
                  }
                  value={userData.fees || ""}
                  name="fees"
                  placeholder="Enter your consultation fees"
                
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#05acb4] focus:shadow-md"
                />
              </div>
            </div>
            <div className="mb-5">
              <div className="w-full px-3">
                <label
                  htmlFor="email"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Profile Description
                </label>
                <textarea
                  onChange={(e) =>
                    setUserData({ ...userData, description: e.target.value })
                  }
                  value={(userData?.description as string) || ""}
                  rows={10}
                  className="appearance-none rounded-lg block w-full bg-gray-200 text-gray-700 border border-gray-200 h-24  py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                ></textarea>
              </div>
            </div>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Gender
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="email"
                  value={userData.gender}
                  placeholder="Enter your your gender"
                  readOnly
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#05acb4] focus:shadow-md"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="hover:shadow-form w-full rounded-md bg-[#05acb4] py-3 px-8 text-center text-base font-semibold text-white outline-none"
              >
                Update
              </button>
              <SyncLoader cssOverride={override} loading={loading} />
            </div>
          </form>
        </div>
        {modalOpen && (
          <ProfileModal
            setAvatar={(url: string) => setImageURL(url)}
            closeModal={() => setModalOpen(false)}
            side={"doctor"}
          />
        )}
      </div>
    </>
  );
};
export default DoctorProfile;
