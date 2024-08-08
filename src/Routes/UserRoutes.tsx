import { Route,Routes } from "react-router-dom"
import UserLangingPage from "../Pages/UserPages/UserLandingPage"
import UserLoginPage from "../Pages/UserPages/UserLoginPage"
import UserSignUpPage from "../Pages/UserPages/UserSignUpPage"
import UserOtpVerification from "../Pages/UserPages/UserOtpVerification"
import UserProfileLayout from "../Pages/UserPages/UserProfileLayout"
import UserProfile from "../Components/UserComponents/UserProfile"
import UserAppointments from "../Components/UserComponents/UserAppointments"
import ErrorPage from "../Components/extra/ErrorPage"
import PasswordResetPage from "../Components/UserComponents/PasswordResetPage"
import BookAppointmentsList from "../Pages/UserPages/BookAppointmentsList"
import UserDoctorDetailPage from "../Pages/UserPages/UserDoctorDetailPage"
import UserPaymentPage from "../Pages/UserPages/UserPaymentPage"


const UserRoute=()=>{

    return (
      <Routes>
        <Route path="/" element={<UserLangingPage />} />

        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/signup" element={<UserSignUpPage />} />
        <Route path="/otpVerify" element={<UserOtpVerification />} />
        <Route path="/reset-password" element={<PasswordResetPage/>}  />
        <Route path="/doctorBooking" element={<BookAppointmentsList/>}/>
        <Route path="/doctorDetail/:id" element={<UserDoctorDetailPage/>}/>
        <Route path="/payment/:id" element={<UserPaymentPage/>} />

        {/* Profile layout */}
        <Route path="/profile" element={<UserProfileLayout />}>
          <Route path="" element={<UserProfile />} />
          <Route path="appointment" element={<UserAppointments />} />
        </Route>
        <Route path="*" element={<ErrorPage side="user" />} />
        {/* Profile layout end */}
      </Routes>
    );




}
export default UserRoute