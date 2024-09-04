import AdminLogin from "../../Components/AdminComponents/Login"
import withAuthentication from "../../hooks and functions/withAuthentication"
import bg from "@/assets/bg-2.jpg";

const AdminLoginPage=()=>{
    return (
      <div
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        <AdminLogin />
      </div>
    );
}
export default withAuthentication(AdminLoginPage,"admin")