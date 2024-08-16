import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import instance from "../../Axios/doctorInstance";
import UserDoctorDetail from "../UserComponents/UserDoctorDetail";
import moment from "moment";
import { Loader } from "rsuite";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ZIM } from "zego-zim-web";


const DoctorUserProfile=()=>{

    const [appointmentDetails,setAppointmentDetails]=useState<any>(null)
    console.log("appointments",appointmentDetails)
    const {id}=useParams()
     const [zp, setZp] = useState<any>(null);
     const [enableCall, setEnableCall] = useState(false);


    const fetchAppointmentData=useCallback(async()=>{

        const response=await instance.get(`/appointmentDetail/${id}`)
        if(response.data.success){
            setAppointmentDetails(response.data.detail)

        }

    },[id])
    useEffect(()=>{
        fetchAppointmentData()

    },[fetchAppointmentData])
    function calculateAge(dob: Date): number {
      const today = new Date();
      const birthDate = new Date(dob);

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    }

    useEffect(()=>{
        const initZego=()=>{
            const appId = 1196584464;
            const serverSecret="61417d53b06fde2e6cb32210b0b35b57"
            const token = ZegoUIKitPrebuilt.generateKitTokenForTest(
              appId,
              serverSecret,
              "frgregrg",
              id as string ,
              `userName${id}`
            );
            const  zegoInstance=ZegoUIKitPrebuilt.create(token)
             zegoInstance.addPlugins({ ZIM });
             setZp(zegoInstance);
        }
        initZego()

        return ()=>{
            if(zp){
                zp.desroy()
            }
        }


    },[id])
    const invite=()=>{
         const targetUser = {
           userID:appointmentDetails?._id, 
           userName: appointmentDetails?.userName,
           image: appointmentDetails?.image,
         };
        zp.sendCallInvitation({
          callees: [targetUser],
          callType: ZegoUIKitPrebuilt.InvitationTypeVideoCall,
          timeout: 60,
        })
          .then((res: any) => {
            console.warn("Invitation sent:", res);
          })
          .catch((err: any) => {
            console.error("Error sending invitation:", err);
          });
    }

    const handleConsultation=()=>{
        setEnableCall(true)
        invite()

    }

    return (
      <div className="p-16 ">
        <div className="p-8 bg-white shadow mt-24 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0"></div>
            <div className="relative">
              <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                <img
                  className=" rounded-full"
                  src={
                    appointmentDetails?.image ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  alt="no img"
                />

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
              <button
                onClick={handleConsultation}
                className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
              >
                Start Consultation
              </button>
            </div>
          </div>

          <div className="mt-20 text-center border-b pb-12">
            <h1 className="text-4xl font-medium text-gray-700">
              {appointmentDetails?.userName.toUpperCase()},{" "}
              <span className="font-light text-gray-500">
                {appointmentDetails?.dob
                  ? calculateAge(appointmentDetails?.dob)
                  : ""}
              </span>
            </h1>
            <p className="font-light text-gray-600 mt-3">
              {appointmentDetails?.city}, {appointmentDetails?.state}
            </p>
            <p className="mt-3 text-gray-500">
              Blood Group - {appointmentDetails?.bloodGroup}
            </p>
            <p className="mt-2 text-gray-500">
              Appointment date :{" "}
              {moment(appointmentDetails?.date).format("MMMM D, YYYY")}{" "}
            </p>
            <p className="mt-2 text-gray-500">
              Appointment time :{" "}
              {moment(appointmentDetails?.start).format("h:mm A")}-{" "}
              {moment(appointmentDetails?.end).format("h:mm A")}
            </p>
          </div>

          <div className="mt-12 flex flex-col justify-center">
            <p className="text-gray-600 text-3xl text-center font-bold lg:px-16">
              Medical Records
            </p>
            <button className="text-indigo-500 py-2 px-4 font-medium mt-4">
              Show more
            </button>
          </div>
        </div>

        {enableCall && zp && <div id="zego-video-call">{zp.joinRoom()}</div>}
      </div>
    );
}
export default DoctorUserProfile