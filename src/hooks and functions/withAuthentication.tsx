import Cookies from "js-cookie";
import { ComponentType, useEffect } from "react";
import { useNavigate } from "react-router-dom";



const withAuthentication=<P extends Object>(WrappedComponent:ComponentType<P>,userType:string="")=>{
    return (props:P)=>{

        const navigate=useNavigate()
      useEffect(() => {
        
      const verifyToken = async () => {
        
        
        try {
          if(userType==="admin"){
             const accessToken = Cookies.get("adminAccessToken");
            

             const response = await fetch("http://localhost:4000/admin/verify-token", {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          console.log("response",response)

        const data = await response.json();
       
        if(data.success){
            navigate("/admin")
        }
          }else if (userType === "doctor") {
             const accessToken = Cookies.get("accessToken");
                const response = await fetch(
                  "http://localhost:4000/doctor/verify-token",
                  {
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                      "Content-Type": "application/json",
                    },
                  }
                );
                  const data = await response.json();
                  console.log("data is", data);
                  if (data.message == "not yet verified") {
                    navigate("/doctor/otpVerify");
                  } else if (data.success) {
                    navigate("/doctor");
                  }
             

          } else {
            const accessToken = Cookies.get("accessToken");
            const response = await fetch("http://localhost:4000/verify-token", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            });
            console.log("response", response);

            const data = await response.json();
            console.log("data is", data);
            if (data.message == "not yet verified") {
              navigate("/otpVerify");
            } else if (data.success) {
              navigate("/");
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