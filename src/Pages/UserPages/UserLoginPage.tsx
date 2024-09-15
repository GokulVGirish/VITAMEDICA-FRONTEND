import UserLogin from "../../Components/UserComponents/Login";
import withAuthentication from "../../hooks and functions/withAuthentication";

const UserLoginPage = () => {
  return (
    <div className="bg-[#928EDE] h-screen">
      <UserLogin />
    </div>
  );
};

export const AuthenticatedUserLoginPage = withAuthentication(UserLoginPage);
