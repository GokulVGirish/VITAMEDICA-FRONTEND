import axios from "axios";
import Cookies from "js-cookie";
const apiUrl = import.meta.env.VITE_Image_API_URL;

const instance = axios.create({
  baseURL: apiUrl || "https://www.vitamedica.ix.tc/api/image-upload",
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
export default instance