import Cookies from "js-cookie";
import { ComponentType, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";



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
                  "http://localhost:4000/admin/verify-token",
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
                 "http://localhost:4000/doctor/verify-token",
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
                 "http://localhost:4000/token/verify",
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