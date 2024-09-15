import { useNavigate } from "react-router-dom";
import instance from "../Axios/userInstance";
import doctorInstance from "../Axios/doctorInstance";
import adminInstance from "../Axios/adminInstance";
import { useEffect } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";
const useVerifyToken = (userType = "") => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        let response;
        if (userType === "admin") {
          response = await adminInstance.get("/auth/token/verify-token");
          if (response.status === 401) {
            // navigate("/admin/login");
          }
        } else if (userType === "doctor") {
          response = await doctorInstance.get("/auth/token/verify-token");
          if (response.status === 401) {
            toast.error(response.data.message, {
              richColors: true,
              duration: 1500,
              onAutoClose: () => {
                return navigate("/doctor/login");
              },
            });
          }
        } else {
          response = await instance.get("/auth/token/verify-token");
          if (response.status === 401) {
            //  navigate("/login");
          }
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (userType === "admin") {
            navigate("/admin/login");
          } else if (userType === "doctor") {
            toast.error(error.response?.data.message, {
              richColors: true,
              duration: 1500,
              onAutoClose: () => {
                return navigate("/doctor/login");
              },
            });
          } else {
            navigate("/login");
          }
        }
      }
    };

    verifyToken();
  }, [navigate]);
};
export default useVerifyToken;
