import logo from "@/assets/logo1.png";
import doctor from "@/assets/cover2.jpg";
import { useNavigate } from "react-router-dom";
import { useReducer, useRef, useState } from "react";
import Cookies from "js-cookie";
import { GoogleLogin } from "@react-oauth/google";
import { clearErrorMessage, updateName } from "../../Redux/userSlice";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch } from "../../Redux/hoocks";
import instance from "../../Axios/userInstance";
import { AxiosError } from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import Spinner from "../extra/Spinner";
import { useContext } from "react";
import { SocketContext } from "../../socketio/SocketIo";

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
    | { type: "SET_GENDER"; value: string }
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
    case "SET_GENDER":
      return {
        ...state,
        gender: action.value,
      };
    default:
      return state;
  }
};

const UserSignUp = () => {
  const navigate = useNavigate();
  const [state, myDispatch] = useReducer(myReducer, initialState);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const passInput1 = useRef<HTMLInputElement>(null);
  const passInput2 = useRef<HTMLInputElement>(null);
  const [pass1Visibility, setPass1Visibility] = useState(false);
  const [pass2Visibility, setPass2Visibility] = useState(false);
  const socket = useContext(SocketContext);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    if (!state.name.trim()) {
      return toast.error("Name is required", {
        richColors: true,
        duration: 1500,
      });
    } else if (!nameRegex.test(state.name)) {
      return toast.error("Invalid name format", {
        richColors: true,
        duration: 1500,
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!state.email.trim()) {
      return toast.error("Email is required", {
        richColors: true,
        duration: 1500,
      });
    } else if (!emailRegex.test(state.email)) {
      return toast.error("Invalid email format", {
        richColors: true,
        duration: 1500,
      });
    }
    const phoneRegex = /^\d{10}$/;
    if (!state.phone.trim()) {
      return toast.error("Phone number is required", {
        richColors: true,
        duration: 1500,
      });
    } else if (!phoneRegex.test(state.phone)) {
      return toast.error("Phone number must be 10 digits", {
        richColors: true,
        duration: 1500,
      });
    }

    if (!state.gender.trim()) {
      return toast.error("Select a gender", {
        richColors: true,
        duration: 1500,
      });
    } else if (state.gender !== "male" && state.gender !== "female") {
      return toast.error("Gender must be either male or female", {
        richColors: true,
        duration: 1500,
      });
    }

    if (!state.bloodGroup.trim()) {
      return toast.error("select a blood group", {
        richColors: true,
        duration: 1500,
      });
    }
    const today = new Date();
    const dob = new Date(state.dob);
    const minAge = 18;
    const maxAge = 120;
    const age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (!state.dob.trim()) {
      return toast.error("Date of birth is required", {
        richColors: true,
        duration: 1500,
      });
    } else if (dob > today) {
      return toast.error("Date of birth must be in the past", {
        richColors: true,
        duration: 1500,
      });
    } else if (
      age < minAge ||
      (age === minAge && monthDiff < 0) ||
      (age === minAge && monthDiff === 0 && today.getDate() < dob.getDate())
    ) {
      return toast.error(`You must be at least ${minAge} years old`, {
        richColors: true,
        duration: 1500,
      });
    } else if (
      age > maxAge ||
      (age === maxAge && monthDiff > 0) ||
      (age === maxAge && monthDiff === 0 && today.getDate() > dob.getDate())
    ) {
      return toast.error(`You must be less than ${maxAge} years old`, {
        richColors: true,
        duration: 1500,
      });
    }

    if (!state.password.trim()) {
      return toast.error("Password is required", {
        richColors: true,
        duration: 1500,
      });
    } else if (state.password.length < 6) {
      return toast.error("Password must be at least 6 characters", {
        richColors: true,
        duration: 1500,
      });
    } else if (!/\W/.test(state.password)) {
      return toast.error("Password must contain at least one symbol", {
        richColors: true,
        duration: 1500,
      });
    } else if (!/[A-Z]/.test(state.password)) {
      return toast.error(
        "Password must contain at least one uppercase letter",
        {
          richColors: true,
          duration: 1500,
        }
      );
    }

    if (!state.cpassword.trim()) {
      return toast.error("Confirm Password is required", {
        richColors: true,
        duration: 1500,
      });
    } else if (state.password !== state.cpassword) {
      return toast.error("Passwords do not match", {
        richColors: true,
        duration: 1500,
      });
    }

    try {
      setLoading(true);
      const response = await instance.post("/auth/signup", state);
      Cookies.set("accessToken", response.data.token, { expires: 1 / 24 / 12 });
      console.log("state", state);

      if (response.data.success) {
        toast.success(response.data.message, {
          richColors: true,
          duration: 1500,
        });

        setTimeout(() => {
          setLoading(false);

          navigate("/otpVerify", { replace: true });
        }, 2000);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message, {
          richColors: true,
          duration: 1500,
        });
      }
      setLoading(false);
    }
  };
  //k
  return (
    <div className="py-10 ">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
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

                setLoading(true);
                try {
                  const response = await instance.post(
                    "/auth/google/login",
                    data
                  );
                  if (response.data.success) {
                    Cookies.set("accessToken", response.data.accessToken, {
                      expires: 1 / 24,
                    });
                    Cookies.set("refreshToken", response.data.refreshToken, {
                      expires: 1,
                    });
                    toast.success(response.data.message, {
                      richColors: true,
                      duration: 1500,
                    });
                    socket?.emit("loggedin", response.data.userId);
                    dispatch(updateName(response.data.name));
                    if (response.data.message === "Signed Up Sucessfully")
                      socket?.emit("send_notification", {
                        receiverId: response.data.userId,
                        content: `Thankyou for being a part of vitamedica.Hurry up complete your profile`,
                        type: "welcome",
                      });

                    dispatch(clearErrorMessage());
                    setTimeout(() => {
                      setLoading(false);
                      navigate("/", { replace: true });
                    }, 2000);
                  }
                } catch (error) {
                  if (error instanceof AxiosError) {
                    toast.error(error.response?.data?.message, {
                      richColors: true,
                      duration: 1500,
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
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
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Gender
                </label>
                <select
                  value={state.gender}
                  onChange={(e) =>
                    myDispatch({ type: "SET_GENDER", value: e.target.value })
                  }
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Blood Group
                </label>
                <select
                  value={state.bloodGroup}
                  onChange={(e) =>
                    myDispatch({
                      type: "SET_BLOOD_GROUP",
                      value: e.target.value,
                    })
                  }
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
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
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Date of Birth
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
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  ref={passInput1}
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
                <FontAwesomeIcon
                  className="absolute right-3 bottom-3"
                  icon={!pass1Visibility ? faEyeSlash : faEye}
                  onClick={() => {
                    if (passInput1.current) {
                      passInput1.current.type =
                        passInput1.current.type === "password"
                          ? "text"
                          : "password";
                      setPass1Visibility(!pass1Visibility);
                    }
                  }}
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Confirm Password
                </label>
              </div>
              <div className="relative">
                <input
                  ref={passInput2}
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
                <FontAwesomeIcon
                  className="absolute right-3 bottom-3"
                  icon={!pass2Visibility ? faEyeSlash : faEye}
                  onClick={() => {
                    if (passInput2.current) {
                      passInput2.current.type =
                        passInput2.current.type === "password"
                          ? "text"
                          : "password";
                      setPass2Visibility(!pass2Visibility);
                    }
                  }}
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#928EDE] text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
              >
                SignUp
              </button>
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
        {loading && <Spinner isUser={true} />}
      </div>
    </div>
  );
};
export default UserSignUp;
