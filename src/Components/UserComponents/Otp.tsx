import logo from '@/assets/logo2.png';
import { useEffect,useState } from 'react';
import { useAppDispatch } from '../../Redux/hoocks';
import { useAppSelector } from '../../Redux/hoocks';
import { verifyOtpSigup } from '../../Redux/userSlice';
import { ToastContainer,Zoom,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from 'react-router-dom';
import { clearErrorMessage } from '../../Redux/userSlice';
import Cookies from 'js-cookie';
import instance from '../../Axios/axios';
import axios, { AxiosError } from 'axios';
const Otp=()=>{
    const [seconds, setSeconds] = useState(120)
    const [otp,setOtp]=useState<string>("")
    const [error1,setErrors]=useState<{error?:string}>({})
    const [loadingM,setLoading]=useState<boolean>(false)
    const {message,error,loading}=useAppSelector((state)=>state.user)
      const dispatch = useAppDispatch();
      const navigate=useNavigate()
      const accessToken=Cookies.get("accessToken")

      useEffect(()=>{
        const verify=async()=>{
         
          try{
               const response = await axios.get(
                 "http://localhost:4000/token/verify",
                 {
                   headers: {
                     Authorization: `Bearer ${accessToken}`,
                   },
                 }
               );
             
                if(response.status===200){
                  navigate("/")
                }

          }
          catch(error){
           
           if(error instanceof AxiosError){
            if(error.response?.status===403 && error.response.data.message==="not yet verified"){

            }else{
              navigate("/login")
            }
           }else{
            navigate("/login")
           }

          }
        }
   if(accessToken){
         verify()
   }else{
    navigate("/login")
   }


      },[])
    useEffect(()=>{


        const interval=setInterval(()=>{
            setSeconds((prevState)=>{
                if(prevState>0){
                    return prevState-1
                }else{
                    clearInterval(interval)
                    return 0
                }
            })


        },1000)

        return ()=>clearInterval(interval)


    },[seconds])
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
        if(message==="signed Up Sucessfully"){
            setTimeout(()=>{
                navigate("/")
                dispatch(clearErrorMessage())

            },3000)

        }

    },[message,error,loading])
   

        const override = {
       display: "flex",
       justifyContent: "center",
     };
     const handleResend=async()=>{
      setLoading(true)

      
     try{
       const response = await instance.post("/otp/resend");
      if(response.data.success){ 
        setSeconds(120);
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

      }catch(error){
        if(error instanceof AxiosError){
              toast.error(error.response?.data.message, {
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
              if(error.response?.data.message==="retry signup"){
                Cookies.remove("accessToken")
                setTimeout(() => {
                  navigate("/signup")
                  
                }, 3000);
              }

        }
      }
      setLoading(false)

     }
    const handleSubmit=(e:React.FormEvent)=>{
        setErrors({})
        e.preventDefault()
        
           if (!/^\d*$/.test(otp)) {
             setErrors({error:"please enter a number as otp"});
             
             return
            }else if(otp.length!==4){
                
                setErrors({error:"Invalid otp length"});
               
                return
            }else if(otp===""){
                
             setErrors({error:"Enter an otp"});
             return

            }
            dispatch(verifyOtpSigup({otp}))


    }
    return (
         <div className="flex flex-1 flex-col justify-center space-y-5 max-w-md mx-auto pt-24">
      <div className="flex flex-col space-y-2 text-center">
     <img src={logo} alt="logo" className='rounded-lg shadow-xl'/>
        <p className="text-md md:text-xl text-[#364f6b] font-medium">Enter the OTP we just sent you.</p>
      </div>
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
    <form onSubmit={handleSubmit}>
          <div className="flex flex-col max-w-md space-y-5">
      <div className='flex justify-center'>
          <input
          type="text"
          name='otp'
          placeholder="otp"
          onChange={(e)=>setOtp(e.target.value)}
          className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-l-lg font-medium placeholder:font-normal"
        />
    
         <button type='button' onClick={handleResend} disabled={seconds>0||loadingM} className={`flex items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-r-lg border-black font-medium ${(seconds>0||loadingM)?"bg-slate-300":"bg-black"}  text-white`}>
          resend
        </button>

      </div>
       {error1?.error && (
                                    <span className="text-red-500 text-center text-lg ">{error1.error}</span>
                                )}
       <div className='flex items-center gap-4 flex-col w-full'>
         <button type='submit' className="flex w-full  items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium border-black bg-black text-white">
          Confirm
        </button>
           <SyncLoader cssOverride={override} loading={loading} />
         <div className="w-36 mx-1 p-2 bg-black flex flex-col items-center justify-center gap-3 h-24 text-white  rounded-lg">
                <div className="font-mono text-4xl leading-none" x-text="seconds">{seconds.toString().padStart(2,"0")}</div>
                <div className="font-mono uppercase text-lg  leading-none">Seconds</div>
            </div>
       </div>
      </div>
    </form>
    </div>
        
    )
}
export default Otp