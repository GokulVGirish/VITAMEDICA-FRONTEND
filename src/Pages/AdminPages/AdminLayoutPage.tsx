import AdminSideBar from "../../Components/AdminComponents/SideBar"
import { Outlet } from "react-router-dom"
import useVerifyToken from "../../hooks and functions/verifyToken"

const AdminLayoutPage=()=>{
  useVerifyToken("admin")
    return(
        <>
         <div className="flex h-screen bg-gray-100">
            <AdminSideBar/>
              <div className="flex flex-col flex-1 overflow-y-auto">
                
                <Outlet/>

              </div>
         </div>
        </>



    )
}
export default AdminLayoutPage