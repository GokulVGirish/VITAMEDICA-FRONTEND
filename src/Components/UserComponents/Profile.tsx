import { FaEdit } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import instance from "../../Axios/userInstance";
import { AxiosError } from "axios";
import PasswordChangeModal from "../extra/PasswordChangeMoadal";
import { motion } from "framer-motion";
import {toast} from "sonner"
import ProfileModal from "../extra/ProfileModal";
import Spinner from "../extra/Spinner";
import { useAppDispatch } from "../../Redux/hoocks";
import { updateName } from "../../Redux/userSlice";

export type InitialStateType = {
  name: string;
  email: string;
  phone: string | null;
  dob: string | null;
  gender: string | null;
  password: string;
  image:string
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: number;
  };
  bloodGroup: string | null;
};


const UserProfile = () => {
  const [userData, setUserData] = useState<InitialStateType>({
    name: "",
    email: "",
    phone: null,
    dob: null,
    gender: null,
    password: "",
    image: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: 0,
    },
    bloodGroup: null,
  });
  const [imageURL, setImageURL] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [showUpdateButton,setShowUpdateButton]=useState(false)
  const dispatch=useAppDispatch()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await instance.get("/profile");

        if (response.data.success) {
          setUserData(response.data.userData);
          setImageURL(response.data.userData.image || "");
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message, {
            richColors: true,
            duration: 1500,
          });
        }
      }
    };
    fetchUserData();
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowUpdateButton(true)
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       setShowUpdateButton(true);
    const { name, value } = e.target;
    setUserData({
      ...userData,
      address: { ...userData.address, [name]: value },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("state before validation", userData);

    const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    if (!userData.name.trim()) {
      return toast.error("Name is required", {
        richColors: true,
        duration: 1500,
      });
    } else if (!nameRegex.test(userData.name)) {
      return toast.error("Invalid name format", {
        richColors: true,
        duration: 1500,
      });
    }
        const phoneRegex = /^\d{10}$/;
        if (!userData.phone || !userData.phone.trim()) {
          return toast.error("Phone number is required", {
            richColors: true,
            duration: 1500,
          });
        } else if (!phoneRegex.test(userData.phone)) {
          return toast.error("Phone number must be 10 digits", {
            richColors: true,
            duration: 1500,
          });
        }
 
    if (!userData.address) {
      return toast.error("fill in the address field", {
        richColors: true,
        duration: 1500,
      });
    } else {
      if (
        !userData.address ||
        !userData.address.street ||
        !userData.address.street.trim()
      ) {
        return toast.error("Street is required", {
          richColors: true,
          duration: 1500,
        });
      }

      if (
        !userData.address ||
        !userData.address.city ||
        !userData.address.city.trim()
      ) {
        return toast.error("City is required", {
          richColors: true,
          duration: 1500,
        });
      }

      if (
        !userData.address ||
        !userData.address.state ||
        !userData.address.state.trim()
      ) {
        return toast.error("State is required", {
          richColors: true,
          duration: 1500,
        });
      }

      if (!userData.address || !userData.address.postalCode) {
        return toast.error("Postal code is required", {
          richColors: true,
          duration: 1500,
        });
      } else {
        const postalCodeStr = userData.address.postalCode.toString();
        if (!/^\d{6}$/.test(postalCodeStr)) {
          return toast.error("Postal code must be a 6-digit number", {
            richColors: true,
            duration: 1500,
          });
        }
      }
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("phone", userData.phone as string);
    formData.append("dob", userData.dob as string);
    formData.append("gender", userData.gender as string);
    formData.append("bloodGroup", userData.bloodGroup as string);
    formData.append("street", userData.address.street as string);
    formData.append("city", userData.address.city as string);
    formData.append("state", userData.address.state as string);
    formData.append("zip", userData.address.postalCode.toString());
    try {
      const response = await instance.put("/profile", formData);
      if (response.data.success) {
        setLoading(false)
        dispatch(updateName(response.data.data.name));
        toast.success(response.data.message, {
          richColors: true,
          duration: 1500,
        });
      }

      console.log("response", response.data);
 
      setUserData(response.data.data);
    } catch (error) {
           setLoading(false);
      if (error instanceof AxiosError) {
        console.log(error.response?.data.message);
      }
    }
  };
  




  const handleChangePassword = async () => {
    try {
      setPasswordModalOpen(true);
      await instance.post("/profile/password/reset-request", {
        email: userData.email,
      });
    } catch (error) {}
  };

  

  return (
    <>
      <div className="flex items-center justify-center p-12 h-full mt-20 mb-40">
        <motion.div
          className="mx-auto w-full  max-w-[550px] bg-gray-100"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full relative flex justify-center pt-12 "
          >
            <img
              className="h-40 w-40  rounded-full border-4 border-gray-700 mx-auto my-4"
              src={
                imageURL ||
                "https://img.freepik.com/premium-vector/gray-color-user-icon-vector-illustration_276184-162.jpg"
              }
              alt=""
            />

            <div
              onClick={() => setModalOpen(true)}
              className="absolute top-44 right-48 cursor-pointer flex items-center justify-center h-12 w-12 bg-[#928EDE] text-black rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <FaEdit className="h-6 w-6" />
            </div>
          </motion.div>
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
                value={userData.name || ""}
                id="name"
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
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
                    readOnly
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
                    readOnly
                    id="time"
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
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
                    readOnly
                    name="bloodGroup"
                    value={userData.bloodGroup || ""}
                    onChange={handleInputChange}
                    id="time"
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  />
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
                  </div>
                </div>
              </div>
            </div>
            <div>
              {showUpdateButton && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
                >
                  Update
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
        {passwordModalOpen && (
          <PasswordChangeModal
            modalOpen={(status: boolean) => setPasswordModalOpen(status)}
          />
        )}
        {loading && <Spinner isUser={true} />}
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