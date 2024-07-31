import axios from "axios"
import Cookies from "js-cookie";
import { toast } from "sonner";



const instance = axios.create({
  baseURL: "http://localhost:4000/doctor",
  headers: {
    "Content-Type": "application/json",
  },
});
instance.interceptors.request.use(
  (request) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);
instance.interceptors.request.use(
    (response)=>response,
    (error)=>{
             if (error.response && error.response.status === 401) {
               toast.error(error.response.data.message, {
                 richColors: true,
                 duration: 1500,
                 onAutoClose: () => {
                   return (window.location.href = "/doctor/login");
                 },
               });
             }
             return Promise.reject(error);
    }
)
export default instance