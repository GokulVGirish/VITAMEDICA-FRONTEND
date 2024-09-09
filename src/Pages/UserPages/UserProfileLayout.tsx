import UserProfileSideBar from "../../Components/UserComponents/SideBar"
import { Outlet } from "react-router-dom"
import useVerifyToken from "../../hooks and functions/verifyToken";
import Navbar from "../../Components/UserComponents/Navbar";
const UserProfileLayout=()=>{
  useVerifyToken()
    return (
      <>
     
        <div className="flex h-screen bg-gray-100">
          <UserProfileSideBar />
          <div className="flex flex-col flex-1 h-screen overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </>
    );
}
export default UserProfileLayout