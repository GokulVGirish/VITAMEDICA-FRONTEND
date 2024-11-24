import axios from "axios";
import { toast } from "sonner";
const apiUrl = import.meta.env.VITE_USER_API_URL;
import { clearUser } from "../Redux/userSlice";

let dispatchFunction: any = null;

export const setDispatch = (dispatch: any) => {
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
  (response) => response,
  async(error) => {
    console.log(error)
    
    if (error.response && error.response.status === 401) {
      if (dispatchFunction) {
        dispatchFunction(clearUser());
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
          return (window.location.href = "/login");
        },
      });
    } else if (
      (error.response &&
        error.response.status === 401 &&
        window.location.pathname == "/login") ||
      window.location.pathname == "/signup"
    ) {
      
    }else{
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
