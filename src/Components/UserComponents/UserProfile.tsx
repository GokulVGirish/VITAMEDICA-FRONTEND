import { FaEdit } from "react-icons/fa";
import React, { useEffect, useState, useRef } from "react";
import instance from "../../Axios/axios";
import { AxiosError } from "axios";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SyncLoader from "react-spinners/SyncLoader";
import ProfileModal from "../extra/ProfileModal";
import EmailChangeModal from "../extra/PasswordChangeMoadal";
export type InitialStateType = {
  name: string;
  email: string;
  phone: string | null;
  dob: string | null;
  gender: string | null;
  password: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: number;
  };
  bloodGroup: string | null;
};
 const override = {
   display: "flex",
   justifyContent: "center",
 };
type PartialErrorType = Partial<InitialStateType>;

const UserProfile = () => {
  const [userData, setUserData] = useState<InitialStateType>({
    name: "",
    email: "",
    phone: null,
    dob: null,
    gender: null,
    password: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: 0,
    },
    bloodGroup: null,
  });
  const [imageURL, setImageURL] = useState<string>();
  const [myErrors, setMyErrors] = useState<any>({});
  const [loading,setLoading]=useState(false)
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen,setPasswordModalOpen]=useState(false)

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await instance.get("/profile");
        console.log("hello", response);
        if (response.data.success) {
          setUserData(response.data.userData);
          console.log("userffsd", response.data.userData.image);
          setImageURL(response.data.userData.image||"");
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(error.response?.data.message);
        }
      }
    };
    fetchUserData();
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      address: { ...userData.address, [name]: value },
    });
  };
  const handleSubmit = async(e: React.FormEvent) => {
    console.log("called")
    e.preventDefault();
    console.log("state before validation", userData);
    const validationErrors: any = { address: {} };
    const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    if (!userData.name.trim()) {
      validationErrors.name = "Name is required";
    } else if (!nameRegex.test(userData.name)) {
      validationErrors.name = "Invalid name format";
    }
    if (userData.gender !== "male" && userData.gender !== "female") {
      validationErrors.gender = "Gender must be either male or female";
    }
    if (!userData.bloodGroup || !userData.bloodGroup.trim()) {
      validationErrors.bloodGroup = "select a blood group";
    }
    const phoneRegex = /^\d{10}$/; // Adjust as per your requirement
    if (!userData.phone || !userData.phone.trim()) {
      validationErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(userData.phone)) {
      validationErrors.phone = "Phone number must be 10 digits";
    }
    const today = new Date();
    const minAge = 18;
    const maxAge = 120;

    if (!userData.dob || !userData.dob.trim()) {
      validationErrors.dob = "Date of birth is required";
    } else {
      const dob = new Date(userData.dob);
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      const dayDiff = today.getDate() - dob.getDate();

      if (dob > today) {
        validationErrors.dob = "Date of birth must be in the past";
      } else if (
        age < minAge ||
        (age === minAge && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))
      ) {
        validationErrors.dob = `You must be at least ${minAge} years old`;
      } else if (
        age > maxAge ||
        (age === maxAge && (monthDiff > 0 || (monthDiff === 0 && dayDiff > 0)))
      ) {
        validationErrors.dob = `You must be less than ${maxAge} years old`;
      }
    }
 
    if (!userData.address) {
      validationErrors.addressError = "fill in the address field";
    } else {
      if (
        !userData.address ||
        !userData.address.street ||
        !userData.address.street.trim()
      ) {
        validationErrors.address!.street = "Street is required";
      }

      if (
        !userData.address ||
        !userData.address.city ||
        !userData.address.city.trim()
      ) {
        validationErrors.address!.city = "City is required";
      }

      if (
        !userData.address ||
        !userData.address.state ||
        !userData.address.state.trim()
      ) {
        validationErrors.address!.state = "State is required";
      }

      if (!userData.address || !userData.address.postalCode) {
        validationErrors.address!.postalCode = "Postal code is required";
      } else {
        const postalCodeStr = userData.address.postalCode.toString();
        if (!/^\d{6}$/.test(postalCodeStr)) {
          validationErrors.address!.postalCode =
            "Postal code must be a 6-digit number";
        }
      }
    }

    const addressErrors =
      validationErrors.address &&
      Object.keys(validationErrors.address).length > 0;
      console.log("adderesserr",addressErrors)

    if (Object.keys(validationErrors).length > 1 || addressErrors) {
      console.log("validation errors", validationErrors);
      setMyErrors(validationErrors);
      console.log("error", myErrors);
      return;
    }
    setMyErrors({})
    setLoading(true)
    const formData=new FormData()
    formData.append("name",userData.name)
    formData.append("phone",userData.phone as string)
    formData.append("dob",userData.dob as string)
    formData.append("gender",userData.gender as string)
    formData.append("bloodGroup",userData.bloodGroup as string);
    formData.append("street", userData.address.street as string);
    formData.append("city", userData.address.city as string);
    formData.append("state", userData.address.state as string);
    formData.append("zip", userData.address.postalCode.toString());
 try{
     const response = await instance.put("/profile", formData);
     if(response.data.success){
        toast.success(response.data.message, {
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
     }

     console.log("response",response.data)
     setLoading(false)
     setUserData(response.data.data)

 }
 catch(error){
  if(error instanceof AxiosError){
    console.log(error.response?.data.message)
  }

 }
  };
  const handleChangePassword=async()=>{
    try{
      setPasswordModalOpen(true);
      const response = await instance.post("/profile/password/reset-request", {
        email: userData.email,
      });


    }
    catch(error){
    
    }
  }


  return (
    <>
      <div className="flex items-center justify-center p-12 h-full mt-20 mb-40">
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
        <div className="mx-auto w-full  max-w-[550px] bg-gray-100">
          <div className="w-full relative flex justify-center pt-12 ">
            <img
              className="h-40 w-40  rounded-full border-4 border-gray-700 mx-auto my-4"
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
                value={userData.name || ""}
                id="name"
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {myErrors?.name && (
                <span className="text-red-500 text-xs">{myErrors.name}</span>
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
                value={userData.phone || ""}
                type="text"
                onChange={handleInputChange}
                name="phone"
                id="phone"
                placeholder="Enter your phone number"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              {myErrors?.phone && (
                <span className="text-red-500 text-xs">{myErrors.phone}</span>
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
                  value={userData.email || ""}
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  readOnly
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
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
                  type="email"
                  value={userData.password || ""}
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  readOnly
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                <FaEdit
                  onClick={handleChangePassword}
                  className="absolute top-4 right-4 cursor-pointer"
                />
              </div>
            </div>

            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/3">
                <div className="mb-5">
                  <label
                    htmlFor="date"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={
                      userData.dob
                        ? new Date(userData.dob).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setUserData({ ...userData, dob: e.target.value })
                    }
                    id="date"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                  {myErrors?.dob && (
                    <span className="text-red-500 text-xs">{myErrors.dob}</span>
                  )}
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/3">
                <div className="mb-5">
                  <label
                    htmlFor="time"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Gender
                  </label>
                  <input
                    type="text"
                    value={userData.gender || ""}
                    name="gender"
                    id="time"
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                  {myErrors?.gender && (
                    <span className="text-red-500 text-xs">
                      {myErrors.gender}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/3">
                <div className="mb-5">
                  <label
                    htmlFor="time"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Blood Group
                  </label>
                  <input
                    type="text"
                    name="bloodGroup"
                    value={userData.bloodGroup || ""}
                    onChange={handleInputChange}
                    id="time"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
                  {myErrors?.bloodGroup && (
                    <span className="text-red-500 text-xs">
                      {myErrors.bloodGroup}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-5 pt-3">
              <label className="mb-5 block text-base font-semibold text-[#07074D] sm:text-xl">
                Address Details
              </label>
              <div className="-mx-3 flex flex-wrap">
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <input
                      type="text"
                      value={userData.address?.street || ""}
                      onChange={handleAddressChange}
                      name="street"
                      id="area"
                      placeholder="Enter street"
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                    {myErrors?.address?.street && (
                      <span className="text-red-500 text-xs">
                        {myErrors?.address?.street}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <input
                      type="text"
                      name="city"
                      onChange={handleAddressChange}
                      value={userData.address?.city || ""}
                      id="city"
                      placeholder="Enter city"
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                    {myErrors?.address?.city && (
                      <span className="text-red-500 text-xs">
                        {myErrors?.address?.city}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <input
                      type="text"
                      value={userData.address?.state || ""}
                      onChange={handleAddressChange}
                      name="state"
                      id="state"
                      placeholder="Enter state"
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                    {myErrors?.address?.state && (
                      <span className="text-red-500 text-xs">
                        {myErrors?.address?.state}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full px-3 sm:w-1/2">
                  <div className="mb-5">
                    <input
                      type="text"
                      name="postalCode"
                      value={userData?.address?.postalCode || ""}
                      id="post-code"
                      placeholder="Post Code"
                      onChange={handleAddressChange}
                      className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                    />
                    {myErrors?.address?.postalCode && (
                      <span className="text-red-500 text-xs">
                        {myErrors?.address?.postalCode}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {myErrors?.addressError && (
                <span className="text-red-500 text-xs">
                  {myErrors?.addressError}
                </span>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
              >
                Update
              </button>
              <SyncLoader cssOverride={override} loading={loading} />
            </div>
          </form>
        </div>
        {passwordModalOpen && (
          <EmailChangeModal
            modalOpen={(status: boolean) => setPasswordModalOpen(status)}
          />
        )}
        {modalOpen && (
          <ProfileModal
            setAvatar={(url: string) => setImageURL(url)}
            closeModal={() => setModalOpen(false)}
            side={"user"}
          />
        )}
      </div>
    </>
  );
};
export default UserProfile;
