import { useEffect,useRef,useState } from "react";
import { FaEdit } from "react-icons/fa";
import instance from "../../Axios/doctorInstance";
import { AxiosError } from "axios";
import ProfileModal from "../extra/ProfileModal";
import SyncLoader from "react-spinners/SyncLoader";
import "react-image-crop/dist/ReactCrop.css";
import {toast} from "sonner"
import PasswordChangeModal from "../extra/PasswordChangeMoadal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faExclamationCircle,
  faMoneyCheck,
} from "@fortawesome/free-solid-svg-icons";

export type Doctor = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  department: string;
  password: string;
  description: string | null;
  image: string | null;
  documentsUploaded?: boolean;
  bankDetails: {
    accountNumber:string;
    ifsc: string;
  };
  documents?: {
    certificateImage: string | null;
    qualificationImage: string | null;
    aadarFrontImage: string | null;
    aadarBackImage: string | null;
    yearsOfExperience: number | null;
  } | null;
  isBlocked?: boolean;
  status?: "Pending" | "Submitted" | "Verified";
  fees: string | null;
  degree: string | null;
  complete?:boolean;
};
const DoctorProfile = () => {
    const [userData, setUserData] = useState<Doctor>({
      _id: "",
      name: "",
      email: "",
      phone: "",
      gender: "",
      department: "",
      password: "",
      image: "",
      description: "",
      fees: "",
      degree: "",
      bankDetails: {
        accountNumber: "",
        ifsc: "",
      },
    });
    const inputRef = useRef<HTMLInputElement>(null);
      const [imageURL, setImageURL] = useState<string>();
      const [image, setImage] = useState<File>();
       const [myErrors, setMyErrors] = useState<any>({});
       const [modalOpen,setModalOpen]=useState(false)
       const [loading,setLoading]=useState(false)
        const [passwordModalOpen, setPasswordModalOpen] = useState(false);
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

     const accountNumberRegex = /^\d{9,18}$/;
     if (!userData?.bankDetails?.accountNumber || !userData?.bankDetails?.accountNumber.trim()) {
       validationErrors.accountNumber = "Bank account number is required";
     } else if (!accountNumberRegex.test(userData?.bankDetails?.accountNumber)) {
       validationErrors.accountNumber = "Invalid bank account number format";
     }

  
     const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
     if (!userData?.bankDetails?.ifsc || !userData?.bankDetails?.ifsc.trim()) {
       validationErrors.ifsc = "IFSC code is required";
     } else if (!ifscRegex.test(userData?.bankDetails?.ifsc)) {
       validationErrors.ifsc = "Invalid IFSC code format";
     }


  


           if(Object.keys(validationErrors).length>0){
            setMyErrors(validationErrors)
            return
           }
          try{
            setLoading(true)
             const response = await instance.put("/profile",userData);
             setLoading(false)
             if (response.data.success) {
               setUserData((prevState)=>({...prevState,complete:true}));
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
    const handleChangePassword = async () => {
      try {
        setPasswordModalOpen(true);
        const response = await instance.post(
          "/profile/password/reset-request",
          {
            email: userData.email,
          }
        );
      } catch (error) {}
    };

  return (
    <>
      {userData?.complete===false && (
        <div className="absolute top-5 right-5 flex items-center justify-center h-52 w-56 bg-yellow-50 border-l-4 border-yellow-400 shadow-md rounded-lg p-4 text-yellow-800">
          <div className="flex items-start space-x-2">
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="text-yellow-500 mt-1"
            />
            <div className="text-sm font-semibold">
              <p className="mb-1">Complete Your Profile</p>
              <p className="text-yellow-700 font-normal">
                Become visible to patients by adding details to your profile. A
                well-rounded profile helps attract more appointments!
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="flex  items-center relative mt-52  justify-center p-24 h-full  ">
        <div className="mx-auto w-full  max-w-[550px] bg-gray-100">
          <div className="w-full relative flex justify-center pt-10 ">
            <img
              className="h-40 w-40  rounded-full border-4 border-white dark:border-[#56aac6] mx-auto my-4"
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
                <FaEdit
                  onClick={handleChangePassword}
                  className="absolute top-4 right-4 cursor-pointer"
                />
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
            <div className="mb-5 border-t-2 pt-4">
              <label className="mb-3 block text-lg font-semibold text-[#07074D]">
                Add Bank
              </label>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    name="accountNumber"
                    placeholder="Add Account Number"
                    value={userData?.bankDetails?.accountNumber}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        bankDetails: {
                          ...userData.bankDetails,
                          accountNumber: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-md border border-gray-300 bg-gray-50 py-3 px-4 text-base font-medium text-gray-700 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                    <FontAwesomeIcon icon={faBuildingColumns} />
                  </span>
                  {myErrors?.accountNumber && (
                    <span className="text-red-500 text-center text-xs">
                      {myErrors?.accountNumber}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="ifscCode"
                    placeholder="Add Bank IFSC code"
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        bankDetails: {
                          ...userData?.bankDetails,
                          ifsc: e.target.value,
                        },
                      })
                    }
                    value={userData?.bankDetails?.ifsc}
                    className="w-full rounded-md border border-gray-300 bg-gray-50 py-3 px-4 text-base font-medium text-gray-700 outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition"
                  />
                  <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                    <FontAwesomeIcon icon={faMoneyCheck} />
                  </span>
                  {myErrors?.ifsc && (
                    <span className="text-red-500 text-center text-xs">
                      {myErrors?.ifsc}
                    </span>
                  )}
                </div>
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
        {passwordModalOpen && (
          <PasswordChangeModal
            modalOpen={(status: boolean) => setPasswordModalOpen(status)}
          />
        )}
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
