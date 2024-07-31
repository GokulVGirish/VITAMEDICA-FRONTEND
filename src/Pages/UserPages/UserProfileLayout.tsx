import UserProfileSideBar from "../../Components/UserComponents/UserProfileSideBar"
import { Outlet } from "react-router-dom"
const UserProfileLayout=()=>{
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