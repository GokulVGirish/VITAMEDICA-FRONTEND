import Cookies from "js-cookie";
import { ComponentType, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
const adminApiUrl = import.meta.env.VITE_ADMIN_API_URL;
const userUrl = import.meta.env.VITE_USER_API_URL;
const doctorUrl = import.meta.env.VITE_DOCTOR_API_URL;



const withAuthentication=<P extends Object>(WrappedComponent:ComponentType<P>,userType:string="")=>{
    return (props:P)=>{

        const navigate=useNavigate()
        const {pathname}=useLocation()
        console.log("pathname",pathname)
      useEffect(() => {
        
      const verifyToken = async () => {
        
        
        try {
          if(userType==="admin"){
             const accessToken = Cookies.get("adminAccessToken");
             if(accessToken){
                const response = await fetch(
                  `${
                    adminApiUrl 
                  }/api/admin/auth/verify-token`,
                  {
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                  }
                );
                console.log("response", response);

                const data = await response.json();

                if (data.success) {
                  navigate("/admin");
                }

             }else{
              navigate("/admin/login")
             }
            

           
          }else if (userType === "doctor") {
             const accessToken = Cookies.get("accessToken");
             if(accessToken){
               console.log("access with", accessToken);
               const response = await fetch(
                 `${
                   doctorUrl 
                 }/auth/verify-token`,
                 {
                   method: "GET",
                   headers: {
                     Authorization: `Bearer ${accessToken}`,
                     "Content-Type": "application/json",
                   },
                   credentials: "include",
                 }
               );
               const data = await response.json();
               console.log("data is", data);
               if (data.message == "not yet verified") {
                 navigate("/doctor/otpVerify");
               } else if (data.success) {
                 navigate("/doctor");
               }

             }
            
             
            
             

          } else {
            const accessToken = Cookies.get("accessToken");
            if(accessToken){
               const response = await fetch(
                 `${
                   userUrl 
                 }/auth/token/verify`,
                 {
                   method: "GET",
                   headers: {
                     Authorization: `Bearer ${accessToken}`,
                     "Content-Type": "application/json",
                   },
                   credentials: "include",
                 }
               );
               console.log("response", response);

               const data = await response.json();
               console.log("data is", data);
               if (data.message == "not yet verified") {
                 navigate("/otpVerify");
               } else if (data.success) {
                 navigate("/");
               }

            }
           
          }
           

        } catch (error) {
            console.log("error",error)
          
        }
      };

      verifyToken();
    }, [navigate]);

        return <WrappedComponent {...props}/>

    }


}
export default withAuthentication