import logo from "@/assets/logo1.png";
import doctor from "@/assets/cover1.jpg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext, useRef } from "react";
import { loginUser, googleLogin } from "../../Redux/userSlice";
import { toast } from "sonner";
import { clearErrorMessage } from "../../Redux/userSlice";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAppSelector, useAppDispatch } from "../../Redux/hoocks";
import { SocketContext } from "../../socketio/SocketIo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../extra/Spinner";




const UserLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, loading, message } = useAppSelector((state) => state.user);
  const passwordRefObj = useRef<HTMLInputElement>(null);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const socket = useContext(SocketContext);

  const dispatch = useAppDispatch();

  dispatch(clearErrorMessage());

  const handleSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return toast.error("Email is required", {
        richColors: true,
        duration: 1500,
      });
    } else if (!emailRegex.test(email)) {
      return toast.error("Invalid email format", {
        richColors: true,
        duration: 1500,
      });
    }

    if (!password.trim()) {
      return toast.error("Password is required", {
        richColors: true,
        duration: 1500,
      });
    } else if (password.length < 6) {
      return toast.error("Password must be at least 6 characters", {
        richColors: true,
        duration: 1500,
      });
    }

    dispatch(loginUser({ email: email, password: password, socket }));
  };
  useEffect(() => {
    if (error) {
      toast.error(error, { richColors: true, duration: 1500 });
      dispatch(clearErrorMessage());
    }
    if (message) {
      toast.success(message, { richColors: true, duration: 1500 });
    }
    if (message === "logged in Sucessfully"||message==="Signed Up Sucessfully") {
      setTimeout(() => {
        navigate("/");
        dispatch(clearErrorMessage());
      }, 1000);
    }
  }, [error, message, loading]);

  return (
    <>
      <div className="pt-32">
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
            <p className="text-xl text-gray-600 text-center">Welcome back!</p>

            <div className="w-full flex justify-center">
              <GoogleLogin
                ux_mode="popup"
                useOneTap
                shape="pill"
                type="icon"
                theme="outline"
                onSuccess={async (e) => {
                  const data: { name: string; email: string; sub: string } =
                    await jwtDecode(e.credential as string);
                  console.log(data.sub);
                  console.log(data);
                  dispatch(
                    googleLogin({
                      name: data.name,
                      email: data.email,
                      sub: data.sub,
                      socket:socket
                    })
                  );
                }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 lg:w-1/4"></span>
              <a
                href="#"
                className="text-xs text-center text-gray-500 uppercase"
              >
                or login with email
              </a>
              <span className="border-b w-1/5 lg:w-1/4"></span>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    passwordRefObj.current?.focus();
                  }
                }}
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="email"
              />
            </div>
            <div className="mt-4 relative">
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </label>
                <span
                  onClick={() => navigate(`/forgotPassword/${"user"}`)}
                  className="text-xs text-gray-500 cursor-pointer"
                >
                  Forget Password?
                </span>
              </div>
              <input
                value={password}
                ref={passwordRefObj}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                type="password"
              />
              <FontAwesomeIcon
                className="absolute  right-3 bottom-3"
                icon={!passwordVisibility ? faEyeSlash : faEye}
                onClick={() => {
                  if (passwordRefObj.current) {
                    if (passwordRefObj.current.type === "password") {
                      setPasswordVisibility(true);
                      passwordRefObj.current.type = "text";
                    } else {
                      setPasswordVisibility(false);
                      passwordRefObj.current.type = "password";
                    }
                  }
                }}
              />
            </div>
            <div className="mt-8">
              <button
                onClick={handleSubmit}
                type="button"
                disabled={loading}
                className="bg-[#928EDE] text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
              >
                Login
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 md:w-1/4"></span>
              <span
                className="text-xs text-gray-500 uppercase cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                or sign up
              </span>
              <span className="border-b w-1/5 md:w-1/4"></span>
            </div>
          </div>
        </div>
      </div>
      {loading && <Spinner isUser={true}/>}
    </>
  );
};
export default UserLogin;
