
import { ComponentType, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userInstance from "../Axios/userInstance";
import doctorInstance from "../Axios/doctorInstance";
import adminInstance from "../Axios/adminInstance";



const withAuthentication = <P extends Object>(
  WrappedComponent: ComponentType<P>,
  userType: string = ""
) => {
  return (props: P) => {
    const navigate = useNavigate();
  
   const axiosInstance= userType==="doctor"?doctorInstance:userType==="admin"?adminInstance:userInstance
  
 

    useEffect(() => {
      const verifyToken = async () => {
       try{

        const response = await axiosInstance.get("/auth/token/verify-token");
        console.log("response",response.data)
        if(response.data.success) navigate(`/${userType}`)

       }catch(error){

       }
      };
      verifyToken()

      
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
};
export default withAuthentication;
