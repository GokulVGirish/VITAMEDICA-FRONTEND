import { Outlet } from "react-router-dom";
import DoctorSidebar from "../../Components/DoctorComponents/Sidebar";


const DoctorLayoutPage = () => {

   
  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <DoctorSidebar />
        <div className="flex flex-col flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default DoctorLayoutPage;
