import { Route,Routes,useLocation,useNavigate } from "react-router-dom"
import DoctorLoginPage from "../Pages/DoctorPages/DoctorLoginPage"
import DoctorSignUpPage from "../Pages/DoctorPages/DoctorSignUpPage"
import DoctorLayoutPage from "../Pages/DoctorPages/DoctorLayout"
import DoctorDash from "../Components/DoctorComponents/Dashboard"
import DoctorProfile from "../Components/DoctorComponents/Profile"
import DoctorOtpVerification from "../Pages/DoctorPages/DoctorOtpVerification"
import { useAppDispatch, useAppSelector } from "../Redux/hoocks"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"
import DoctorDocumentUpload from "../Components/DoctorComponents/DocumentUpload"
import DoctorAddSlots from "../Components/DoctorComponents/AddSlots"
import ErrorPage from "../Components/extra/ErrorPage"
import DoctorWallet from "../Components/DoctorComponents/Wallet"
import DoctorAppointments from "../Components/DoctorComponents/Appointments"
import DoctorProtectedRoutes from "./ProtectedRoutes/doctorProtectedRoutes"
import DoctorUserProfile from "../Components/DoctorComponents/UserProfile"
import VideoCall from "../communication/videoCall"
import { useContext, useEffect } from "react"
import { SocketContext } from "../socketio/SocketIo"
import { verifyDoctor } from "../Redux/doctorSlice"





const Dummy = () => {
  const status = useAppSelector((state) => state.doctor.docStatus);
  const navigate=useNavigate()


  if (status === "Verified") {
    return null;
  }

  if (status === "Submitted") {
    return (
      <>
        <div
          id="modal-box"
          className="absolute top-32 right-0 items-center sm:w-[385px] sm:min-w-[40vw] min-w-[80vw] min-h-[20vh] flex flex-col justify-center gap-2 -translate-y-1/2 p-6 bg-[#FFFFEB] rounded-lg -translate-x-1/2"
        >
          <span className="text-2xl font-bold">
            Documents Uploaded For Verification
          </span>
          <p className="text-center font-semibold">Waiting For Admin Approval</p>
          <FontAwesomeIcon size="4x" icon={faCircleCheck}/>
         
        
        </div>
      </>
    );
  }

  if (status === "Pending") {
    return (
      <>
        <div
          id="modal-box"
          className="absolute z-20 top-32 right-0 items-center sm:w-[385px] sm:min-w-[40vw] min-w-[80vw] min-h-[20vh] flex flex-col justify-center gap-2 -translate-y-1/2 p-6 bg-[#FFFFEB] rounded-lg -translate-x-1/2"
        >
          <span className="text-2xl font-bold">Upload Documents</span>
          <p className="text-center font-semibold">
            Upload the necessary documents and get verified to be a part of
            VITAMEDICA
          </p>
          <button
          onClick={()=>navigate("/doctor/uploadDocs")}
            id="modal-close"
            className="p-3 bg-[#4F46E5] rounded-lg w-1/2 text-white"
          >
            Proceed To Upload
          </button>
        </div>
      </>
    );
  }

  return null;
};

const DoctorRoute=()=>{
      const location = useLocation();
      const socket=useContext(SocketContext)
      const dispatch=useAppDispatch()
  const validPaths = [
    "/doctor",
    "/doctor/addSlot",
    "/doctor/wallet",
    "/doctor/appointment",
    "/doctor/profile"
    
 
  ];

   const isBasePath = validPaths.includes(location.pathname);
  
   
   const showDummy = isBasePath 
   
   useEffect(()=>{
     socket?.on("doctorVerified", () => {
       dispatch(verifyDoctor("Verified"));
     });

     return ()=>{
      socket?.off("doctorVerified");
     }
    
   },[])
  
  

    return (
      <div className="relative">
        {showDummy && <Dummy />}
     

        <Routes>
        
          <Route path="/" element={<DoctorLayoutPage />}>
            <Route
              index
              element={
                <DoctorProtectedRoutes>
                  <DoctorDash />
                </DoctorProtectedRoutes>
              }
            />
            <Route
              path="profile"
              element={
                <DoctorProtectedRoutes>
                  <DoctorProfile />
                </DoctorProtectedRoutes>
              }
            />
            <Route path="/uploadDocs" element={<DoctorDocumentUpload />} />
            <Route
              path="addSlot"
              element={
                <DoctorProtectedRoutes>
                  <DoctorAddSlots />
                </DoctorProtectedRoutes>
              }
            />
            <Route
              path="wallet"
              element={
                <DoctorProtectedRoutes>
                  <DoctorWallet />
                </DoctorProtectedRoutes>
              }
            />
            <Route
              path="appointment"
              element={
                <DoctorProtectedRoutes>
                  <DoctorAppointments />
                </DoctorProtectedRoutes>
              }
            />
            <Route path="userProfile/:id" element={<DoctorUserProfile/>}/>
             
      
          </Route>
          <Route path="/login" element={<DoctorLoginPage />} />
          <Route path="/signup" element={<DoctorSignUpPage />} />
          <Route path="/videocall/:appointment/:callerId/:toPersonId/:role" element={<VideoCall/>}/>
          <Route path="/otpVerify" element={<DoctorOtpVerification />} />
          <Route path="*" element={<ErrorPage side="doctor" />} />
        </Routes>
      </div>
    );
}
export default DoctorRoute