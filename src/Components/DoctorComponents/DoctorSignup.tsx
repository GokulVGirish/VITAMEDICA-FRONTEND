import logo from '@/assets/logo1.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useReducer,useState ,useRef} from 'react';
import adminInstance from '../../Axios/doctorInstance';
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SyncLoader from "react-spinners/SyncLoader";
import Cookies from 'js-cookie';
import instance from '../../Axios/doctorInstance';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
const initialState={
  name:"",
  email:"",
  phone:"",
  gender:"",
  department:"",
  password:"",
  cpassword:""
}
type StateType=typeof initialState
type ErrorType=Partial<StateType>
function doctorReducer(state:StateType,action:{type:"SET_FIELD",field:string,value:string}|{type:"SET_GENDER",value:string}|{type:"SET_DEPARTMENT",value:string}){

  switch(action.type){
    case "SET_FIELD":
                     return {...state,[action.field]:action.value}
    case "SET_GENDER":
      return {
        ...state,gender:action.value
      }
    case "SET_DEPARTMENT":
      return {
        ...state,department:action.value
      }   
    default:
      return state                
  }

}

const DoctorSignUp=()=>{
  const [state,dispatch]=useReducer(doctorReducer,initialState)
  const [myErrors,setMyErrors]=useState<ErrorType>({})
  const [loading,setLoading]=useState(false)
  const [departments,setDepartments]=useState<{_id:string,name:string}[]>([])
  const passInput1 = useRef<HTMLInputElement>(null);
  const passInput2 = useRef<HTMLInputElement>(null);
  const [pass1Visibility, setPass1Visibility] = useState(false);
  const [pass2Visibility, setPass2Visibility] = useState(false);
  


    const navigate=useNavigate()
     const override = {
       display: "flex",
       justifyContent: "center",
     };

    const handleSubmit=async(e:React.FormEvent)=>{
      e.preventDefault()
      setMyErrors({})
      const validationErrors:ErrorType={}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!state.email.trim()) {
            validationErrors.email = 'Email is required';
        } else if (!emailRegex.test(state.email)) {
            validationErrors.email = 'Invalid email format';
        }

  
        if (!state.password.trim()) {
            validationErrors.password = 'Password is required';
        } else if (state.password.length < 6) {
            validationErrors.password = 'Password must be at least 6 characters';
        } else if (!/\W/.test(state.password)) {
            validationErrors.password = 'Password must contain at least one symbol';
        } else if (!/[A-Z]/.test(state.password)) {
            validationErrors.password = 'Password must contain at least one uppercase letter';
        }
          

  
        if (!state.cpassword.trim()) {
            validationErrors.cpassword = 'Confirm Password is required';
        } else if (state.password !== state.cpassword) {
            validationErrors.cpassword = 'Passwords do not match';
        }

     
        const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
        if (!state.name.trim()) {
            validationErrors.name = 'Name is required';
        } else if (!nameRegex.test(state.name)) {
            validationErrors.name = 'Invalid name format';
        }

        
        if (state.gender !== 'male' && state.gender !== 'female') {
       
            validationErrors.gender = 'Gender must be either male or female';
        }
      
        if(!state.department.trim()){
          validationErrors.department="select a department"
        }

        const phoneRegex = /^\d{10}$/;
        if (!state.phone.trim()) {
            validationErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(state.phone)) {
            validationErrors.phone = 'Phone number must be 10 digits';
        }
        if(Object.keys(validationErrors).length>0){
          setMyErrors(validationErrors)
          return

        }
        console.log("doctor state is",state)
        setLoading(true)
        const response = await adminInstance.post("/auth/signup",state);
      
        if(response.data.success){
          Cookies.set("accessToken", response.data.token, {
            expires: 1 / 24 / 12,
          });
             toast.success(response.data.message, {
               position: "top-right",
               autoClose: 1000,
               hideProgressBar: false,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: true,
               progress: undefined,
               theme: "colored",
               transition: Zoom,
             });
             setTimeout(()=>{
              navigate("/doctor/otpVerify");
                setLoading(false);

             },1500)

        }else{
             toast.error(response.data.message, {
               position: "top-right",
               autoClose: 1500,
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
    useEffect(()=>{
      const getDepartments=async()=>{
        const response = await instance.get("/utility/departments");
        if(response.data.success){
           setDepartments(response.data.departments);

        }


      }
      getDepartments()

    },[])
    return (
      <div className="container flex flex-col mx-auto rounded-lg  ">
        <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <ToastContainer
            position="top-right"
            autoClose={1500}
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
          <div className="flex items-center justify-center w-full ">
            <div className="flex items-center  ">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full h-full px-10 py-4 text-center bg-transparent rounded-3xl"
              >
                <div className="flex w-full justify-center">
                  <img
                    className="w-80 rounded-lg shadow-lg"
                    src={logo}
                    alt="logo"
                  />
                </div>
                <p className="mb-4 mt-3 text-grey-700">
                  Welcome to our family Doctor
                </p>

                <div className="flex items-center mb-3">
                  <hr className="h-0 border-b border-solid border-grey-500 grow" />
                  <p className="mx-4 text-grey-600">or</p>
                  <hr className="h-0 border-b border-solid border-grey-500 grow" />
                </div>
                <label className="mb-2 text-sm text-start text-grey-900">
                  Name*
                </label>
                <input
                  value={state.name}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: e.target.name,
                      value: e.target.value,
                    })
                  }
                  name="name"
                  type="text"
                  placeholder="enter name"
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl shadow-lg"
                />
                {myErrors?.name && (
                  <span className="text-red-500 text-xs">{myErrors.name}</span>
                )}
                <label className="mb-2 text-sm text-start text-grey-900">
                  Email*
                </label>
                <input
                  value={state.email}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: e.target.name,
                      value: e.target.value,
                    })
                  }
                  name="email"
                  type="text"
                  placeholder="example@gmail.com"
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl shadow-lg"
                />
                {myErrors?.email && (
                  <span className="text-red-500 text-xs">{myErrors.email}</span>
                )}
                <label className="mb-2 text-sm text-start text-grey-900">
                  Phone*
                </label>
                <input
                  value={state.phone}
                  type="text"
                  onChange={(e) =>
                    dispatch({
                      type: "SET_FIELD",
                      field: e.target.name,
                      value: e.target.value,
                    })
                  }
                  name="phone"
                  placeholder="enter phone"
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl shadow-lg"
                />
                {myErrors?.phone && (
                  <span className="text-red-500 text-xs">{myErrors.phone}</span>
                )}
                <label className="mb-2 text-sm text-start text-grey-900">
                  Gender*
                </label>
                <select
                  value={state.gender}
                  onChange={(e) =>
                    dispatch({ type: "SET_GENDER", value: e.target.value })
                  }
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl shadow-lg"
                >
                  <option value="">Select Gender</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                </select>
                {myErrors?.gender && (
                  <span className="text-red-500 text-xs">
                    {myErrors.gender}
                  </span>
                )}
                <label className="mb-2 text-sm text-start text-grey-900">
                  Department*
                </label>
                <select
                  value={state.department}
                  onChange={(e) =>
                    dispatch({ type: "SET_DEPARTMENT", value: e.target.value })
                  }
                  className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl shadow-lg"
                >
                  <option value="">Select An Department</option>
                  {departments &&
                    departments.map((department) => {
                      return (
                        <option key={department._id} value={department._id}>
                          {department.name}
                        </option>
                      );
                    })}
                </select>
                {myErrors?.department && (
                  <span className="text-red-500 text-xs">
                    {myErrors.department}
                  </span>
                )}
                <label className="mb-2 text-sm text-start text-grey-900">
                  Password*
                </label>
                <div className="relative">
                  <input
                    ref={passInput1}
                    value={state.password}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: e.target.name,
                        value: e.target.value,
                      })
                    }
                    name="password"
                    type="password"
                    placeholder="Enter a password"
                    className="flex shadow-lg items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                  />
                  <FontAwesomeIcon
                    className="absolute cursor-pointer right-3 bottom-9"
                    icon={!pass1Visibility ? faEyeSlash : faEye}
                    onClick={() => {
                      if (passInput1.current) {
                        if (passInput1.current.type === "password") {
                          setPass1Visibility(true);
                          passInput1.current.type = "text";
                        } else {
                          setPass1Visibility(false);
                          passInput1.current.type = "password";
                        }
                      }
                    }}
                  />
                </div>
                {myErrors?.password && (
                  <span className="text-red-500 text-xs">
                    {myErrors.password}
                  </span>
                )}
                <label className="mb-2 text-sm text-start text-grey-900">
                  {" "}
                  Confirm Password*
                </label>
                <div className="relative">
                  <input
                    value={state.cpassword}
                    ref={passInput2}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: e.target.name,
                        value: e.target.value,
                      })
                    }
                    name="cpassword"
                    type="password"
                    placeholder="Confirm password"
                    className="flex shadow-lg items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                  />
                  <FontAwesomeIcon
                    className="absolute cursor-default right-3 bottom-9"
                    icon={!pass2Visibility ? faEyeSlash : faEye}
                    onClick={() => {
                      if (passInput2.current) {
                        if (passInput2.current.type === "password") {
                          setPass2Visibility(true);
                          passInput2.current.type = "text";
                        } else {
                          setPass2Visibility(false);
                          passInput2.current.type = "password";
                        }
                      }
                    }}
                  />
                </div>
                {myErrors?.cpassword && (
                  <span className="text-red-500 mb-2 text-xs">
                    {myErrors.cpassword}
                  </span>
                )}

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full px-6 py-4 ext-sm font-bold leading-none text-white bg-black transition duration-300 md:w-96 rounded-2xl hover:bg-purple-blue-600 focus:ring-4 focus:ring-purple-blue-100 bg-purple-blue-500"
                >
                  Sign In
                </button>
                <SyncLoader cssOverride={override} loading={loading} />
                <p className="text-sm cursor-pointer leading-relaxed text-grey-900">
                  Not registered yet?{" "}
                  <span
                    className="font-bold text-grey-700"
                    onClick={() => navigate("/doctor/login")}
                  >
                    already have an account? Login
                  </span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
}
export default DoctorSignUp