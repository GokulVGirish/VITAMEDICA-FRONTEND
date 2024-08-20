import logo from '@/assets/logo1.png';
import doctor from '@/assets/cover1.jpg';
import { useNavigate } from 'react-router-dom';
import { useState,useEffect, useContext, useReducer, useRef } from 'react';
import { loginUser,googleLogin } from '../../Redux/userSlice';
import { ToastContainer,Zoom,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SyncLoader from "react-spinners/SyncLoader";
import { clearErrorMessage } from '../../Redux/userSlice';
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";



import { useAppSelector ,useAppDispatch} from '../../Redux/hoocks';
import { SocketContext } from '../../socketio/SocketIo';

interface partialError{
    email?:string;
    password?:string
}
 
const UserLogin=()=>{
    const navigate=useNavigate()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [myerrors,setMyErrors]=useState<partialError>({})
    const {error,loading,message}=useAppSelector((state)=>state.user)
    const passwordRefObj=useRef<HTMLInputElement>(null)
    const socket=useContext(SocketContext)
   
   
    const dispatch=useAppDispatch()
      const override = {
       display: "flex",
       justifyContent: "center",
     };
       dispatch(clearErrorMessage());
      

    const handleSubmit=()=>{
        setMyErrors({})
          const validationErrors: partialError = {};
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            validationErrors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            validationErrors.email = 'Invalid email format';
        }

          if (!password.trim()) {
            validationErrors.password = 'Password is required';
        } else if (password.length < 6) {
            validationErrors.password = 'Password must be at least 6 characters';
        } else if (!/\W/.test(password)) {
            validationErrors.password = 'Password must contain at least one symbol';
        } else if (!/[A-Z]/.test(password)) {
            validationErrors.password = 'Password must contain at least one uppercase letter';
        }
        if(Object.keys(validationErrors).length!==0){
           
            setMyErrors(validationErrors)
            return
        }
        
        dispatch(loginUser({email:email,password:password,socket}))

      


    }
    useEffect(()=>{
        if(error){
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
                  dispatch(clearErrorMessage());
               
        }
        if(message){
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
         if(message==="logged in Sucessfully"){
            setTimeout(()=>{
                navigate("/")
                dispatch(clearErrorMessage())

            },3000)

        }

    },[error,message,loading])



    return (
      <>
        <div className="pt-32">
          <ToastContainer
            position="top-right"
            autoClose={1000}
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
                    console.log(data);
                    dispatch(
                      googleLogin({
                        name: data.name,
                        email: data.email,
                        sub: data.sub,
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
                  onKeyDown={(e)=>{if(e.key==="Enter"){
                    passwordRefObj.current?.focus()

                  }}}
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                  type="email"
                />
                {myerrors?.email && (
                  <span className="text-red-500 text-xs">{myerrors.email}</span>
                )}
              </div>
              <div className="mt-4">
                <div className="flex justify-between">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Password
                  </label>
                  <span className="text-xs text-gray-500 cursor-pointer">
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
                {myerrors?.password && (
                  <span className="text-red-500 text-xs">
                    {myerrors.password}
                  </span>
                )}
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
                <SyncLoader cssOverride={override} loading={loading} />
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
      </>
    );
}
export default UserLogin