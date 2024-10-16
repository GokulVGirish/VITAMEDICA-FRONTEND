import axios from "axios";
import Cookies from "js-cookie";
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
instance.defaults.withCredentials = true;

instance.interceptors.request.use(
  (request) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (dispatchFunction) {
        dispatchFunction(clearDoctor());
      }
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    }
    if (
      error.response &&
      error.response.status === 401 &&
      (error.response.data.message === "Sorry User Blocked" ||
        error.response.data.message === "Un authorized access")
    ) {
      toast.error(error.response.data.message, {
        richColors: true,
        duration: 1500,
        onAutoClose: () => {
          return (window.location.href = "/doctor/login");
        },
      });
    } else if (error.response && error.response.status === 401) {
      return (window.location.href = "/doctor/login");
    }
    return Promise.reject(error);
  }
);

export default instance;
