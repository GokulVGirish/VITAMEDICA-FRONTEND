import React from "react";
import { useCallback, useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance from "../../Axios/axios";
import moment from "moment";
import PdfViewer from "../extra/PdfViewer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "sonner";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { AxiosError } from "axios";

const UserAppointmentDetail = () => {
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [pdfModal, setPdfModal] = useState(false);
  console.log("appointments", appointmentDetails);
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchAppointmentDetail=useCallback(async()=>{

  try{
      const response = await instance.get(`/appointments/${id}/detail`);
      if (response.data.success) {
        setAppointmentDetails(response.data.data)

      }

  }
  catch(error){
    if(error instanceof AxiosError){
      console.log(error.response?.data)
    }

  }

  },[id])
  useEffect(()=>{
    fetchAppointmentDetail()

  },[])
  console.log(appointmentDetails)


  return (
    <div className="p-16 ">
      <div className="p-8 bg-white shadow mt-24 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0"></div>
          <div className="relative">
            <div className="w-48  h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
              <img
                className=" rounded-full"
                src={
                  appointmentDetails?.docImage ||
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

          <div className="space-x-8 flex  justify-between mt-32 md:mt-0 md:justify-center">
            {appointmentDetails?.status === "cancelled" ? (
              <span className="text-white py-2 px-4 uppercase cursor-default rounded bg-red-400  shadow  font-medium transition transform ">
                cancelled
              </span>
            ) : appointmentDetails?.status === "completed" ? (
              <span className="text-white py-2 px-4 uppercase cursor-default rounded bg-green-400  shadow  font-medium transition transform ">
                completed
              </span>
            ) : (
              <button
                className=" py-2 px-4 uppercase rounded text-white bg-yellow-300 hover:bg-yellow-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
              >
                Pending
              </button>
            )}
            {appointmentDetails?.status === "completed" && (
              <span className="" onClick={() => setPdfModal(true)}>
                <FontAwesomeIcon
                  className="size-9 hover:text-gray-400"
                  icon={faFilePdf}
                />
              </span>
            )}
          </div>
        </div>

        <div className="mt-20 text-center border-b pb-12">
          <h1 className="text-4xl font-medium text-gray-700">
            {appointmentDetails?.docName.toUpperCase()}
          </h1>
          <h3 className="text-xl font-medium text-gray-700">
            {appointmentDetails?.docDegree.toUpperCase()}
          </h3>
       
          <p className="mt-2 text-gray-500">
            Booked On :{" "}
            {moment(appointmentDetails?.createdAt).format("MMMM D, YYYY")}{" "}
          </p>
          <p className="mt-2 text-gray-500">
            Amount Payed :{" "}
            {appointmentDetails?.amount}{" "}
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
      {pdfModal && (
        <PdfViewer
          viewPdf={appointmentDetails?.prescription}
          closeModal={() => setPdfModal(false)}
        />
      )}
    </div>
  );
};
export default UserAppointmentDetail;
