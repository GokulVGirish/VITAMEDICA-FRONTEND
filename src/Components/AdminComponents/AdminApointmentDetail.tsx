import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import adminInstance from "../../Axios/adminInstance";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PdfViewer from "../extra/PdfViewer";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";


const AdminAppointmentDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>();
  const [pdfModal, setPdfModal] = useState(false);

  const fetchAppointmentDetail = useCallback(async () => {
    try {
      const response = await adminInstance.get(`/appointments/${id}`);
      if (response.data.success) {
        setData(response.data.data);
        console.log("data received", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching appointment details", error);
    }
  }, [id]);

  useEffect(() => {
    fetchAppointmentDetail();
  }, [fetchAppointmentDetail]);

    return (
      <section className="antialiased bg-gradient-to-r  from-blue-50 to-gray-50 text-gray-600 min-h-screen p-6">
        <div className="h-full">
          <div className="mt-16">
            <div className="relative px-6 sm:px-8 lg:px-10 pb-10 max-w-4xl mx-auto">
              <div className="bg-white px-10 py-8 rounded-lg shadow-lg border border-gray-200">
                <div className="text-center mb-8">
                  <h1 className="text-3xl leading-snug text-gray-800 font-semibold mb-6">
                    Appointment Detail
                  </h1>
                  <div className="flex justify-center gap-14">
                    <div className="flex flex-col items-center text-center">
                      <img
                        className="inline-flex border-4 border-gray-300 rounded-full shadow-lg"
                        src={
                          data?.docImage ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOu8l8KLZ2eDXLQEgKEdzibQETXGc1CfFj28ttb6x63FTFqnnXZDZGpiZ4TcRt1zvtLr8&usqp=CAU"
                        }
                        width="100"
                        height="100"
                        alt="Doctor"
                      />
                      <span className="text-xs">Doctor</span>
                      <h3 className="mt-3 text-xl font-semibold text-gray-700">
                        Dr {data?.docName}
                      </h3>
                      <p className="text-base text-gray-500">
                        Department: {data?.department}
                      </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                      <img
                        className="inline-flex border-4 border-gray-300 rounded-full shadow-lg"
                        src={
                          data?.userImage ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOu8l8KLZ2eDXLQEgKEdzibQETXGc1CfFj28ttb6x63FTFqnnXZDZGpiZ4TcRt1zvtLr8&usqp=CAU"
                        }
                        width="100"
                        height="100"
                        alt="User"
                      />
                      <span className="text-xs ">Patient</span>
                      <h3 className="mt-3 text-xl font-semibold text-gray-700">
                        {data?.userName}
                      </h3>
                      <p className="text-base text-gray-500">
                        DOB: {moment(data?.userAge).format("MMMM D, YYYY")}
                      </p>
                      <p className="text-base text-gray-500">
                        Blood Group: {data?.userBlood}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 bg-slate-100 p-6 rounded-xl">
                  <div className="flex flex-col items-center">
                    <span className="block text-lg font-medium text-gray-700">
                      Appointment Date:{" "}
                      {moment(data?.date).format("MMMM D, YYYY")}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="block text-lg font-medium text-gray-700">
                      Appointment Time: {moment(data?.start).format("h:mm A")} -{" "}
                      {moment(data?.end).format("h:mm A")}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="block text-lg font-medium text-gray-700">
                      Appointment Booked On:{" "}
                      {moment(data?.createdAt).format("MMMM D, YYYY")}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="block text-lg font-medium text-gray-700">
                      Appointment Amount: ₹{data?.amount}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="block text-lg font-medium text-gray-700">
                      Doctor's Fees: ₹{data?.fees}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="block text-lg font-medium text-gray-700">
                      Appointment Status:{" "}
                      <span
                        className={`py-2 px-3 border-none rounded-lg text-xl font-semibold ${
                          data?.status === "completed"
                            ? "text-green-800 bg-green-100"
                            : data?.status === "pending"
                            ? "text-yellow-800 bg-yellow-100"
                            : "text-red-800 bg-red-100"
                        }`}
                      >
                        {data?.status}
                      </span>
                    </span>
                  </div>
                  {data?.prescription && (
                    <div className="flex flex-col items-center">
                      <span className="block text-lg font-medium text-gray-700">
                        Prescription:{" "}
                        <FontAwesomeIcon
                          onClick={() => setPdfModal(true)}
                          className="cursor-pointer text-red-600 hover:text-red-800 transition-colors duration-200"
                          icon={faFilePdf}
                        />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {pdfModal && (
          <PdfViewer
            viewPdf={data?.prescription}
            closeModal={() => setPdfModal(false)}
          />
        )}
      </section>
    );

};

export default AdminAppointmentDetail;