import DoctorLogin from "../../Components/DoctorComponents/DoctorLogin";
import withAuthentication from "../../hooks and functions/withAuthentication";
import bg from "@/assets/bg-1.jpg";

 const DoctorLoginPage=()=>{
    return (
      <div
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          height: "100vh",
       
        }}
        className=""
      >
        <DoctorLogin />
      </div>
    );
 }
 export default withAuthentication(DoctorLoginPage,"doctor")