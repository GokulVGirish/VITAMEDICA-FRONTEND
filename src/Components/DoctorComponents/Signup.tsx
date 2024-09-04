import logo from '@/assets/logo1.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useReducer,useState ,useRef} from 'react';
import adminInstance from '../../Axios/doctorInstance';
import "react-toastify/dist/ReactToastify.css";
import SyncLoader from "react-spinners/SyncLoader";
import Cookies from 'js-cookie';
import instance from '../../Axios/doctorInstance';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import {toast} from "sonner"
import Select, { MultiValue } from "react-select";


const initialState = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  password: "",
  department:[] as string[],
  cpassword: "",
};
type StateType=typeof initialState
function doctorReducer(state:StateType,action:{type:"SET_FIELD",field:string,value:string}|{type:"SET_GENDER",value:string}){

  switch(action.type){
    case "SET_FIELD":
                     return {...state,[action.field]:action.value}
    case "SET_GENDER":
      return {
        ...state,gender:action.value
      }
 
    default:
      return state                
  }

}



const DoctorSignUp=()=>{
  const [state,dispatch]=useReducer(doctorReducer,initialState)
const [loading,setLoading]=useState(false)
  const [departments,setDepartments]=useState<{_id:string,name:string}[]>([])
 const [selectedDepartments, setSelectedDepartments] = useState<
   MultiValue<{
      value: string;
      label: string;
    }>
 >([]);

  const passInput1 = useRef<HTMLInputElement>(null);
  const passInput2 = useRef<HTMLInputElement>(null);
  const [pass1Visibility, setPass1Visibility] = useState(false);
  const [pass2Visibility, setPass2Visibility] = useState(false);
   const navigate=useNavigate()
        console.log("doctor state is", state);
     const override = {
       display: "flex",
       justifyContent: "center",
     };

    const handleSubmit=async(e:React.FormEvent)=>{
      e.preventDefault()

     
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
            
                return toast.error('Email is required', {
                  richColors: true,
                  duration: 1500,
                });
        } else if (!emailRegex.test(state.email)) {
          
                return toast.error('Invalid email format', {
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
            
        if (state.gender !== "male" && state.gender !== "female") {
          return toast.error("Gender must be either male or female", {
            richColors: true,
            duration: 1500,
          });
        }
            
        if (selectedDepartments.length === 0) {
          return toast.error("select atleast one department", {
            richColors: true,
            duration: 1500,
          });
        }else if(selectedDepartments.length>2){
            return toast.error("You can only serve in two fields", {
              richColors: true,
              duration: 1500,
            });

        }

        if (!state.password.trim()) {
          
               return toast.error('Password is required', {
                 richColors: true,
                 duration: 1500,
               });
        } else if (state.password.length < 6) {
               return toast.error('Password must be at least 6 characters', {
                 richColors: true,
                 duration: 1500,
               });
        } else if (!/\W/.test(state.password)) {
              return toast.error('Password must contain at least one symbol', {
                richColors: true,
                duration: 1500,
              });
        
        } else if (!/[A-Z]/.test(state.password)) {
            return toast.error('Password must contain at least one uppercase letter', {
              richColors: true,
              duration: 1500,
            });
            
        }
          

  
        if (!state.cpassword.trim()) {
            return toast.error(
              'Confirm Password is required',
              {
                richColors: true,
                duration: 1500,
              }
            );
      
        } else if (state.password !== state.cpassword) {
           return toast.error('Passwords do not match', {
             richColors: true,
             duration: 1500,
           });
          
        }


     
  

       
     
   
        setLoading(true)
     
        const response = await adminInstance.post("/auth/signup",{...state,department:selectedDepartments.map((option)=>option.value)});
      
        if(response.data.success){
          Cookies.set("accessToken", response.data.token, {
            expires: 1 / 24 / 12,
          });
             toast.success(response.data.message,{richColors:true,duration:1500});
             setTimeout(()=>{
              navigate("/doctor/otpVerify");
                setLoading(false);

             },1500)

        }else{
             toast.error(response.data.message, {richColors:true,duration:1500});
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
      const departmentOptions = departments?.map((dept) => ({
        value: dept._id,
        label: dept.name,
      }));

  const handleSelectChange = (
    selectedOptions: MultiValue<{
      value: string;
      label: string;
    }>
  ) => {
    setSelectedDepartments(selectedOptions);
  };
 const customStyles = {
   control: (provided: any) => ({
     ...provided,
     borderRadius: "12px",
     padding: "6px",
   }),
   menu: (provided: any) => ({
     ...provided,
     borderRadius: "12px",
   }),
   option: (provided: any) => ({
     ...provided,
     borderRadius: "8px",
   }),
   multiValue: (provided: any) => ({
     ...provided,
     borderRadius: "12px",
     backgroundColor: "black",
   }),
   multiValueLabel: (provided: any) => ({
     ...provided,
     color: "white",
   }),
   multiValueRemove: (provided: any) => ({
     ...provided,
     color: "white",
     ":hover": {
       borderTopRightRadius: "12px",
        borderBottomRightRadius: "12px",
       backgroundColor: "red",
       color: "white",
     },
   }),
 };



      console.log("selected Departments",selectedDepartments)



    return (
      <div className="container flex flex-col mx-auto rounded-lg  ">
        <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
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

                <label className="mb-2 text-sm text-start text-grey-900">
                  Department*
                </label>
                <Select
                  isMulti
                  styles={customStyles}
                  options={departmentOptions}
                  value={selectedDepartments}
                  onChange={handleSelectChange}
                />

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