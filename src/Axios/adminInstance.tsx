import axios from "axios";


const apiUrl = import.meta.env.VITE_ADMIN_API_URL;

const adminInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
adminInstance.defaults.withCredentials=true

adminInstance.interceptors.response.use(
  (response) => response,
  (error) => {
   if (
     error.response &&
     error.response.status === 401 &&
     window.location.pathname !== `/admin/login` &&
     window.location.pathname !== `/admin/signup`
   ) {
     window.location.href = "/admin/login";
   }
    return Promise.reject(error);
  }
);

export default adminInstance;
