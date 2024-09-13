import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import adminInstance from "../../Axios/adminInstance";

const RefundDetailModal = ({
  closeModal,
  id,
}: {
  closeModal: () => void;
  id: string;
}) => {
  const [data, setData] = useState<{
    _id: number;
    docName: string;
    userName: string;
    docImg: string;
    userImg: string;
    cancelledBy: string;
    appointmentTime: Date;
    appointmentBookedTime: Date;
    reason: string;
    amount: string;
    cancellationTime: Date;
    start: Date;
    end: Date;
  } | null>(null);

  const fetchRefundDetails = useCallback(async () => {
    try {
      const response = await adminInstance.get(`/payouts/refunds/${id}`);
      if (response.data.success) {
        setData(response.data.refundDetail);
      }
    } catch (error) {}
  }, [id]);
  useEffect(() => {
    fetchRefundDetails();
  }, [fetchRefundDetails]);

  return (
    <div
      className="relative z-30"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto">
        <div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-transparent text-slate-100 text-left transition-all">
          <section className="antialiased bg-gradient-to-r p-6">
            <div className="h-full">
              <div className="relative px-6 sm:px-8 lg:px-10 pb-10 max-w-4xl mx-auto">
                <div className="bg-white relative px-10 py-8 mt-14 rounded-lg shadow-lg">
                  <button
                    type="button"
                    className="rounded-md p-1 inline-flex items-center justify-center text-gray-700 hover:bg-gray-700 focus:outline-none absolute top-2 right-2"
                    onClick={closeModal}
                  >
                    <FontAwesomeIcon
                      onClick={closeModal}
                      icon={faCircleXmark}
                    />
                  </button>
                  <div className="text-center mb-8">
                    <h1 className="text-3xl leading-snug text-gray-800 font-semibold mb-6">
                      Appointment Detail
                    </h1>
                    <div className="flex justify-center gap-14">
                      <div className="flex flex-col items-center text-center">
                        <img
                          className="inline-flex border-4 border-gray-300 rounded-full shadow-lg"
                          src={
                            data?.docImg ||
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
                          {/* Department: {data?.department} */}
                        </p>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <img
                          className="inline-flex border-4 border-gray-300 rounded-full shadow-lg"
                          src={
                            data?.userImg ||
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOu8l8KLZ2eDXLQEgKEdzibQETXGc1CfFj28ttb6x63FTFqnnXZDZGpiZ4TcRt1zvtLr8&usqp=CAU"
                          }
                          width="100"
                          height="100"
                          alt="User"
                        />
                        <span className="text-xs">Patient</span>
                        <h3 className="mt-3 text-xl font-semibold text-gray-700">
                          {data?.userName}
                        </h3>
                        {/* <p className="text-base text-gray-500">
                          DOB: {moment(data?.userAge).format("MMMM D, YYYY")}
                        </p>
                        <p className="text-base text-gray-500">
                          Blood Group: {data?.userBlood}
                        </p> */}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 bg-slate-100 p-6 rounded-xl">
                    <div className="flex flex-col items-center">
                      <span className="block text-lg font-medium text-gray-700">
                        Appointment Date:{" "}
                        {moment(data?.appointmentTime).format("MMMM D, YYYY")}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="block text-lg font-medium text-gray-700">
                        Appointment Time: {moment(data?.start).format("h:mm A")}{" "}
                        - {moment(data?.end).format("h:mm A")}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="block text-lg font-medium text-gray-700">
                        Appointment Booked On:{" "}
                        {moment(data?.appointmentBookedTime).format(
                          "MMMM D, YYYY"
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="block text-lg font-medium text-gray-700">
                        Appointment Cancelled On:{" "}
                        {moment(data?.cancellationTime).format("MMMM D, YYYY")}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="block text-lg font-medium text-gray-700">
                        Cancelled By: {data?.cancelledBy}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="block text-lg font-medium text-gray-700">
                        Reason: {data?.reason}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="block text-lg font-medium text-gray-700">
                        Refunded Amount: ₹{data?.amount}
                      </span>
                    </div>
                    {/* <div className="flex flex-col items-center">
                      <span className="block text-lg font-medium text-gray-700">
                        Doctor's Fees: ₹{data?.fees}
                      </span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
export default RefundDetailModal;
