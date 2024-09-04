import logo from '@/assets/logo1.png';
import SyncLoader from "react-spinners/SyncLoader";
import { useEffect,useRef,useState } from 'react';
import { useAppDispatch,useAppSelector } from '../../Redux/hoocks';
import { clearErrorMessageAdmin } from '../../Redux/adminSlice';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../Redux/adminSlice';
import {toast} from "sonner"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface partialError{
    email?:string;
    password?:string
}
const AdminLogin=()=>{
  const[email,setEmail]=useState<string>("")
  const [password,setPassword]=useState<string>("")
  const {loading,message,error}=useAppSelector((state)=>state.admin)
  const [myErrors,setMyErrors]=useState<partialError>({})
  const passwordRefObject=useRef<HTMLInputElement>(null)
  const [showPassword,setShowPassword]=useState(false)
  const navigate=useNavigate()
  const dispatch=useAppDispatch()
       const override = {
       display: "flex",
       justifyContent: "center",
     };
       const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault()
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
        
        dispatch(adminLogin({email:email,password:password}))

      


    }
    useEffect(()=>{
      if(error){
            toast.error(error, {richColors:true,duration:1500});

      }
       if(message){
            
        toast.success(message, { richColors: true, duration: 1500 });
        }
        if(message==="logged in sucessfully"){
          console.log("innn")
           setTimeout(()=>{
                navigate("/admin")
                dispatch(clearErrorMessageAdmin())

            },1500)


        }





    },[error,message,loading])
  
    return (
      <div className="container flex flex-col mx-auto bg-transparent rounded-lg ">
        <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div className="flex items-center justify-center w-full lg:p-12">
            <div className="flex items-center xl:p-10 ">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full h-full pb-6 text-center bg-transparent rounded-3xl"
              >
                <div className="flex w-full justify-center">
                  <img
                    className="w-80 rounded-lg shadow-lg"
                    src={logo}
                    alt="logo"
                  />
                </div>
                <p className="mb-4 text-grey-700 mt-3">Welcome Admin</p>
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
                  type="email"
                  placeholder="email"
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
                <div className="relative">
                  <input
                    name="password"
                    ref={passwordRefObject}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Enter a password"
                    className="flex shadow-lg items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                  />
                  <FontAwesomeIcon
                    className="absolute h-4  right-4 top-5"
                    icon={!showPassword ? faEyeSlash : faEye}
                    onClick={() => {
                      if (passwordRefObject.current) {
                        if (passwordRefObject.current.type === "password") {
                          setShowPassword(true);
                          passwordRefObject.current.type = "text";
                        } else {
                          setShowPassword(false);
                          passwordRefObject.current.type = "password";
                        }
                      }
                    }}
                  />
                </div>
                {myErrors.password && (
                  <span className="text-red-500 text-center text-md ">
                    {myErrors.password}
                  </span>
                )}
                <div className="flex flex-row justify-between mb-8">
                  <label className="relative inline-flex items-center mr-3 cursor-pointer select-none"></label>
                  <div className="flex justify-center w-full">
                    <span className="mr-4 text-sm font-medium text-purple-blue-500">
                      Forget password?
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none shadow-lg bg-black text-white transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500"
                >
                  Sign In
                </button>
                <SyncLoader cssOverride={override} loading={loading} />
              </form>
            </div>
          </div>
        </div>
      </div>
    );

}
export default AdminLogin