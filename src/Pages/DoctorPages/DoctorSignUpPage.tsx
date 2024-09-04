import DoctorSignUp from "../../Components/DoctorComponents/Signup"
import withAuthentication from "../../hooks and functions/withAuthentication"
import bg from "@/assets/bg-1.jpg";


 const DoctorSignUpPage=()=>{
    return (
      <div
        className=""
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
        }}
      >
        <DoctorSignUp />
      </div>
    );
 }
 export default withAuthentication(DoctorSignUpPage,"doctor");