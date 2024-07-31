import UserSignUp from "../../Components/UserComponents/UserSignUp";
import withAuthentication from "../../hooks and functions/withAuthentication";
const UserSignUpPage=()=>{
  
    return (
  <div className="bg-[#928EDE] min-h-[100vh]">
       <UserSignUp/> 
  </div>

    )
}
export default withAuthentication(UserSignUpPage);