import axios from "axios";
import { toast } from "sonner";
const apiUrl = import.meta.env.VITE_DOCTOR_API_URL;
import { clearDoctor } from "../Redux/doctorSlice";

let dispatchFunction: any = null;
export const setDoctorDispatchFunction = (dispatch: any) => {
  dispatchFunction = dispatch;
};

const instance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
instance.defaults.withCredentials=true


instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async(error) => {
    console.log("doctor",error)
    if (error.response && error.response.status === 401) {
      if (dispatchFunction) {
        dispatchFunction(clearDoctor());
      }
      await instance.post(`/auth/logout`)

 
    }
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "Sorry User Blocked"
    ) {
      toast.error(error.response.data.message, {
        richColors: true,
        duration: 1500,
        onAutoClose: () => {
          return (window.location.href = "/doctor/login");
        },
      });
    } else if (
      (error.response &&
        error.response.status === 401 &&
        window.location.pathname == "/doctor/login") ||
      window.location.pathname == "/doctor/signup"
    ) {

    } 
    return Promise.reject(error);
  }
);

export default instance;
