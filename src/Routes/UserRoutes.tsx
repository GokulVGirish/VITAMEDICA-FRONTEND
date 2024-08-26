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
import PaymentSuccessPage from "../Pages/UserPages/PaymentSuccessPage"
import PaymentFailurePage from "../Pages/UserPages/PaymentFailurePage"
import UserWallet from "../Components/UserComponents/UserWallet"
import { useContext,useState,useEffect } from "react"
import { SocketContext } from "../socketio/SocketIo"
import CallModal from "../Components/extra/CallModal"
import ForgotPassword from "../Components/extra/ForgotPassword"
import ContactPage from "../Pages/UserPages/ContactPage"
import UserAppointmentDetail from "../Components/UserComponents/AppointmentDetail"




const UserRoute=()=>{         
  const socket = useContext(SocketContext);
  const [callData, setCallData] = useState<any>(null);
  const [showCallModal, setShowCallModal] = useState(false);

     socket?.on("call-request", (data: any) => {
       console.log("Received call request:", data);
       setCallData(data);
       setShowCallModal(true);
     });
    
  
  useEffect(() => {
    
    console.log("listening")
  
   
  }, [socket]);

    return (
      <div className="relative">
        {showCallModal && (
          <CallModal
            callData={callData}
            onClose={() => setShowCallModal(false)}
          />
        )}

        <Routes>
          <Route path="/" element={<UserLangingPage />} />

          <Route path="/login" element={<UserLoginPage />} />
          <Route path="/signup" element={<UserSignUpPage />} />
          <Route path="/otpVerify" element={<UserOtpVerification />} />
          <Route path="/forgotPassword/:request" element={<ForgotPassword/>}/>
          <Route path="/reset-password" element={<PasswordResetPage />} />
          <Route path="/doctorBooking" element={<BookAppointmentsList />} />
          <Route path="/doctorDetail/:id" element={<UserDoctorDetailPage />} />
          <Route path="/payment/:id" element={<UserPaymentPage />} />
          <Route path="/paymentSuccess" element={<PaymentSuccessPage />} />
          <Route path="/paymentFailure" element={<PaymentFailurePage />} />
          <Route path="/contact" element={<ContactPage/>}/>

          {/* Profile layout */}
          <Route path="/profile" element={<UserProfileLayout />}>
            <Route path="" element={<UserProfile />} />
            <Route path="appointment" element={<UserAppointments />} />
            <Route path="wallet" element={<UserWallet />} />
            <Route path="appointmentDetail/:id" element={<UserAppointmentDetail/>} />
          </Route>
          <Route path="*" element={<ErrorPage side="user" />} />
          {/* Profile layout end */}
        </Routes>
      </div>
    );




}
export default UserRoute