import { Route,Routes } from "react-router-dom";
import AdminLoginPage from "../Pages/AdminPages/AdminLoginPage";
import AdminLayoutPage from "../Pages/AdminPages/AdminLayoutPage";
import AdminDash from "../Components/AdminComponents/AdminDash";
import UserListing from "../Components/AdminComponents/UserListing";
import DepartmentsListing from "../Components/AdminComponents/DepartmentsListing";
import UnverifiefDoctorsList from "../Components/AdminComponents/UnverifiedDoctorsList";
import DoctorVerify from "../Components/AdminComponents/DoctorVerify";
import DoctorListing from "../Components/AdminComponents/DoctorListing";
import ErrorPage from "../Components/extra/ErrorPage";

const AdminRoute=()=>{
    return (
      <Routes>
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/" element={<AdminLayoutPage />}>
          <Route path="" element={<AdminDash />} />
          <Route path="departments" element={<DepartmentsListing />} />
          <Route path="users" element={<UserListing />} />
          <Route path="doctors" element={<DoctorListing />} />
          <Route path="verifyDoctor" element={<UnverifiefDoctorsList />} />
          <Route path="verifyDoctorDetail/:id" element={<DoctorVerify />} />
        </Route>
        <Route path="*" element={<ErrorPage side="admin" />} />
      </Routes>
    );
}
export default AdminRoute