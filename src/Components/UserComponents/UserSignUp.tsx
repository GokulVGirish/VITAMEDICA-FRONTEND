import logo from "@/assets/logo1.png";
import doctor from "@/assets/cover2.jpg";
import { useNavigate } from "react-router-dom";
import { useReducer, useState } from "react";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SyncLoader from "react-spinners/SyncLoader";
import Cookies from "js-cookie";
import {GoogleLogin,} from "@react-oauth/google"
import { clearErrorMessage } from "../../Redux/userSlice";
import {jwtDecode} from "jwt-decode"
import { useAppDispatch } from "../../Redux/hoocks";
import instance from "../../Axios/axios";
import { AxiosError } from "axios";

const initialState = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  password: "",
  cpassword: "",
  bloodGroup: "",
};
type stateType = typeof initialState;
const myReducer = (
  state: stateType,
  action:
    | { type: "SET_FIELD"; field: string; value: string }
    | { type: "SET_BLOOD_GROUP"; value: string }
): stateType => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "SET_BLOOD_GROUP":
      return {
        ...state,
        bloodGroup: action.value,
      };
    default:
      return state;
  }
};
type partialError = Partial<stateType>;

const UserSignUp = () => {
  const navigate = useNavigate();
  const [state, myDispatch] = useReducer(myReducer, initialState);
  const [errors, setErrors] = useState<partialError | null>();
  const [loading, setLoading] = useState(false);
  const dispatch=useAppDispatch()
  const override = {
    display: "flex",
    justifyContent: "center",
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const validationErrors: partialError = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!state.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!emailRegex.test(state.email)) {
      validationErrors.email = "Invalid email format";
    }

    // Password validation
    if (!state.password.trim()) {
      validationErrors.password = "Password is required";
    } else if (state.password.length < 6) {
      validationErrors.password = "Password must be at least 6 characters";
    } else if (!/\W/.test(state.password)) {
      validationErrors.password = "Password must contain at least one symbol";
    } else if (!/[A-Z]/.test(state.password)) {
      validationErrors.password =
        "Password must contain at least one uppercase letter";
    }
    const today = new Date();
    const dob = new Date(state.dob);
    const minAge = 18;
    const maxAge = 120;
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (!state.dob.trim()) {
      validationErrors.dob = "Date of birth is required";
    } else if (dob > today) {
      validationErrors.dob = "Date of birth must be in the past";
    } else if (
      age < minAge ||
      (age === minAge && monthDiff < 0) ||
      (age === minAge && monthDiff === 0 && today.getDate() < dob.getDate())
    ) {
      validationErrors.dob = `You must be at least ${minAge} years old`;
    } else if (
      age > maxAge ||
      (age === maxAge && monthDiff > 0) ||
      (age === maxAge && monthDiff === 0 && today.getDate() > dob.getDate())
    ) {
      validationErrors.dob = `You must be less than ${maxAge} years old`;
    }

    // Confirm password validation
    if (!state.cpassword.trim()) {
      validationErrors.cpassword = "Confirm Password is required";
    } else if (state.password !== state.cpassword) {
      validationErrors.cpassword = "Passwords do not match";
    }

    // Name validation
    const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    if (!state.name.trim()) {
      validationErrors.name = "Name is required";
    } else if (!nameRegex.test(state.name)) {
      validationErrors.name = "Invalid name format";
    }

    // Gender validation
    if (state.gender !== "male" && state.gender !== "female") {
      validationErrors.gender = "Gender must be either male or female";
    }
    if (!state.bloodGroup.trim()) {
      validationErrors.bloodGroup = "select a blood group";
    }

    // Phone number validation
    const phoneRegex = /^\d{10}$/; // Adjust as per your requirement
    if (!state.phone.trim()) {
      validationErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(state.phone)) {
      validationErrors.phone = "Phone number must be 10 digits";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log("error", errors);
      return;
    }
    setLoading(true);
    const response = await instance.post("/signup", state);
    Cookies.set("accessToken", response.data.token, { expires: 1 / 24 / 12 });
    console.log("state", state);

    if (response.data.success) {
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

      setTimeout(() => {
        setLoading(false);
        navigate("/signup/verify-otp", { replace: true });
      }, 2000);
    } else {
      toast.error(response.data.message, {
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
      setLoading(false);
    }
  };

  return (
    <div className="py-10">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
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

        <div
          className="hidden lg:block lg:w-1/2 bg-cover"
          style={{
            backgroundImage: `url(${doctor})`,
          }}
        ></div>
        <div className="w-full p-8 lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            <img src={logo} alt="logo" />
          </h2>

          <div className="w-full flex justify-center">
            <GoogleLogin
              ux_mode="popup"
              useOneTap
              shape="pill"
              theme="outline"
              onSuccess={async (e) => {
                const data = await jwtDecode(e.credential as string);
                console.log(data);
                setLoading(true)
               try{
                 const response = await instance.post("/google/signup", data);
                if(response.data.success){
                     Cookies.set("accessToken", response.data.accessToken, {
                       expires: 1 / 24,
                     });
                     Cookies.set("refreshToken", response.data.refreshToken, {
                       expires: 1,
                     });
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
                        dispatch(clearErrorMessage());
                      setTimeout(()=>{
                        setLoading(false)
                           navigate("/", { replace: true });

                      },3000)

                }else{
                      toast.error(response.data.message, {
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
                      setLoading(false);
                }
               }catch(error){
                if(error instanceof AxiosError){
                     toast.error(error.response?.data?.message, {
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
                     setLoading(false);

                }
               }

              }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <span className="text-xs text-center text-gray-500 uppercase">
              Register
            </span>
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Name
              </label>
              <input
                name="name"
                onChange={(e) =>
                  myDispatch({
                    type: "SET_FIELD",
                    field: e.target.name,
                    value: e.target.value,
                  })
                }
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="text"
              />
              {errors?.name && (
                <span className="text-red-500 text-xs">{errors.name}</span>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                name="email"
                onChange={(e) =>
                  myDispatch({
                    type: "SET_FIELD",
                    field: e.target.name,
                    value: e.target.value,
                  })
                }
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="text"
              />
              {errors?.email && (
                <span className="text-red-500 text-xs">{errors.email}</span>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phone
              </label>
              <input
                name="phone"
                onChange={(e) =>
                  myDispatch({
                    type: "SET_FIELD",
                    field: e.target.name,
                    value: e.target.value,
                  })
                }
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="text"
              />
              {errors?.phone && (
                <span className="text-red-500 text-xs">{errors.phone}</span>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Gender
              </label>
              <input
                name="gender"
                onChange={(e) =>
                  myDispatch({
                    type: "SET_FIELD",
                    field: e.target.name,
                    value: e.target.value,
                  })
                }
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="text"
              />
              {errors?.gender && (
                <span className="text-red-500 text-xs">{errors.gender}</span>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Blood Group
              </label>
              <select
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                value={state.bloodGroup}
                onChange={(e) =>
                  myDispatch({ type: "SET_BLOOD_GROUP", value: e.target.value })
                }
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              {errors?.bloodGroup && (
                <span className="text-red-500 text-xs">
                  {errors.bloodGroup}
                </span>
              )}
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                date of birth
              </label>
              <input
                name="dob"
                onChange={(e) =>
                  myDispatch({
                    type: "SET_FIELD",
                    field: e.target.name,
                    value: e.target.value,
                  })
                }
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="date"
              />
              {errors?.dob && (
                <span className="text-red-500 text-xs">{errors.dob}</span>
              )}
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
              </div>
              <input
                name="password"
                onChange={(e) =>
                  myDispatch({
                    type: "SET_FIELD",
                    field: e.target.name,
                    value: e.target.value,
                  })
                }
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="password"
              />
              {errors?.password && (
                <span className="text-red-500 text-xs">{errors.password}</span>
              )}
            </div>
            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  {" "}
                  Confirm Password
                </label>
              </div>
              <input
                name="cpassword"
                onChange={(e) =>
                  myDispatch({
                    type: "SET_FIELD",
                    field: e.target.name,
                    value: e.target.value,
                  })
                }
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="password"
              />
              {errors?.cpassword && (
                <span className="text-red-500 text-xs">{errors.cpassword}</span>
              )}
            </div>
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#928EDE] text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
              >
                SignUp
              </button>
              <SyncLoader cssOverride={override} loading={loading} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 md:w-1/4"></span>
              <span
                className="text-xs text-gray-500 uppercase cursor-pointer"
                onClick={() => navigate("/login")}
              >
                or Login
              </span>
              <span className="border-b w-1/5 md:w-1/4"></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default UserSignUp;
