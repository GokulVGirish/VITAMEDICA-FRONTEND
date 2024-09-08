import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
const apiUrl = import.meta.env.VITE_USER_API_URL


const instance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
instance.defaults.withCredentials=true
instance.interceptors.request.use(
    (request)=>{
        console.log("called myy")
   
        const accessToken=Cookies.get("accessToken")
             console.log("aaeffefccxxx",accessToken);
        console.log("called as")
        if(accessToken){
            request.headers.Authorization=`Bearer ${accessToken}`
        }
        return request

    },
    (error)=>Promise.reject(error)
)

instance.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if (
          error.response &&
          error.response.status === 401 &&
          error.response.data.message === "Sorry User Blocked"
        ) {
            Cookies.remove("accessToken")
            Cookies.remove("refreshToken")
          toast.error(error.response.data.message, {
            richColors: true,
            duration: 1500,
            onAutoClose: () => {
              return (window.location.href = "/login");
            },
          });
        }else if (error.response && error.response.status === 401) {
          window.location.href = "/login";
        }
        return Promise.reject(error)
    }

)



export default instance