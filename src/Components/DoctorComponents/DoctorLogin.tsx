import logo from '@/assets/logo1.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SyncLoader from "react-spinners/SyncLoader";
import { clearErrorMessage } from '../../Redux/doctorSlice';
import { useAppDispatch,useAppSelector } from '../../Redux/hoocks';
import { doctorLogin } from "../../Redux/doctorSlice";


interface partialError {
  email?: string;
  password?: string;
}
const DoctorLogin=()=>{
    const navigate=useNavigate()
     const [email, setEmail] = useState<string>("");
     const [password, setPassword] = useState<string>("");
     const { loading, message, error } = useAppSelector((state) => state.doctor);
     const [myErrors, setMyErrors] = useState<partialError>({});
     const dispatch=useAppDispatch()
        const override = {
          display: "flex",
          justifyContent: "center",
        };
        useEffect(()=>{
               if (error) {
                 toast.error(error, {
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
                 dispatch(clearErrorMessage())
               }
               if (message) {
                 toast.success(message, {
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
               if (message === "logged in sucessfully") {
                 console.log("innn");
                 setTimeout(() => {
                   navigate("/doctor");
                   dispatch(clearErrorMessage());
                 }, 3000);
               }

        },[loading,error,message])
        const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          setMyErrors({});
          const validationErrors: partialError = {};
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!email.trim()) {
            validationErrors.email = "Email is required";
          } else if (!emailRegex.test(email)) {
            validationErrors.email = "Invalid email format";
          }

          if (!password.trim()) {
            validationErrors.password = "Password is required";
          } else if (password.length < 6) {
            validationErrors.password =
              "Password must be at least 6 characters";
          } else if (!/\W/.test(password)) {
            validationErrors.password =
              "Password must contain at least one symbol";
          } else if (!/[A-Z]/.test(password)) {
            validationErrors.password =
              "Password must contain at least one uppercase letter";
          }
          if (Object.keys(validationErrors).length !== 0) {
            setMyErrors(validationErrors);
            return;
          }
          dispatch(doctorLogin({email:email,password:password}))

         
        };
    return (
      <div  className="container flex flex-col mx-auto bg-transparent   ">
        <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
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
          <div className="flex items-center  justify-center w-full lg:p-12">
            <div className="flex items-center xl:p-10 ">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full h-full py-6 px-8 text-center bg-transparent rounded-3xl"
              >
                <div className="flex w-full justify-center">
                  <img className="w-80 rounded-lg shadow-lg" src={logo} alt="logo" />
                </div>
                <p className="mb-4 text-grey-700 mt-3">Welcome Doctor</p>

                <div className="flex items-center mb-3">
                  <hr className="h-0 border-b border-solid border-grey-500 grow" />
                  <p className="mx-4 text-grey-600">or</p>
                  <hr className="h-0 border-b border-solid border-grey-500 grow" />
                </div>
                <label className="mb-2 text-sm text-start text-grey-900">
                  Email*
                </label>
                <input
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl shadow-lg"
                />
                {myErrors.email && (
                  <span className="text-red-500 text-center text-md ">
                    {myErrors.email}
                  </span>
                )}
                <label className="mb-2 text-sm text-start text-grey-900">
                  Password*
                </label>
                <input
                  name="password"
                  type='password'
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a password"
                  className="flex shadow-lg items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                />
                {myErrors.password && (
                  <span className="text-red-500 text-center text-md ">
                    {myErrors.password}
                  </span>
                )}
                <div className="flex flex-row justify-between mb-8">
                  <label className="relative inline-flex items-center mr-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked
                      value=""
                      className="sr-only peer"
                    />
                  
                  </label>
                  <div className="flex justify-center w-full">
                    <span className="mr-4 text-sm font-medium text-purple-blue-500">
                      Forget password?
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white bg-black transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500"
                >
                  Sign In
                </button>
                <SyncLoader cssOverride={override} loading={loading} />
                <p className="text-sm leading-relaxed text-grey-900">
                  Not registered yet?{" "}
                  <span
                    className="font-bold text-grey-700 cursor-pointer"
                    onClick={() => navigate("/doctor/signup")}
                  >
                    Create an Account
                  </span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}
export default DoctorLogin