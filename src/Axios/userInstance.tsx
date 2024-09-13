import axios from "axios";
import Cookies from "js-cookie";
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
instance.defaults.withCredentials = true;
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

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (dispatchFunction) {
        dispatchFunction(clearUser());
      }
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
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
    } else if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
