import { Outlet } from "react-router-dom";
import DoctorSidebar from "../../Components/DoctorComponents/DoctorSidebar";
import useVerifyToken from "../../hooks and functions/verifyToken";

const DoctorLayoutPage = () => {
    useVerifyToken("doctor");
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
