import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const instance = axios.create({
  baseURL: "http://localhost:4000/doctor",
  headers: {
    "Content-Type": "application/json",
  },
});
instance.defaults.withCredentials = true;

instance.interceptors.request.use(
  (request) => {
    const accessToken =Cookies.get("accessToken")
    console.log("Request Interceptor Called"); // Debugging line
    console.log("access",accessToken)
    if (accessToken) {
      console.log("inside herre")
      console.log("Setting Access Token:", accessToken); // Debugging line
      request.headers.Authorization = `Bearer ${accessToken}`;
    }
    console.log("Request Headers:", request.headers); // Debugging line
    return request;
  },
  (error) => {
    console.log("Request Interceptor Error:", error); // Debugging line
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    console.log("Response Interceptor Called"); // Debugging line
    return response;
  },
  (error) => {
    console.log("Response Interceptor Error:", error); // Debugging line
    if (
      error.response &&
      error.response.status === 401 &&
      (error.response.data.message === "Sorry User Blocked" ||
        error.response.data.message === "Un authorized access")
    ) {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
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
