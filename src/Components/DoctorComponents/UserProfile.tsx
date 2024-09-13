import {
  useCallback,
  useEffect,
  useState,
  useContext,
  useRef,
  ChangeEvent,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import instance from "../../Axios/doctorInstance";
import moment from "moment";
import PdfViewer from "../extra/PdfViewer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "sonner";

import { SocketContext } from "../../socketio/SocketIo";
import {
  faCircleExclamation,
  faFilePdf,
  faPaperclip,
  faPaperPlane,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import imageInstance from "../../Axios/imageIntsance";
import ImagePreviewSendTime from "../extra/ImagePreviewSendTime";

import EmojiPicker from "emoji-picker-react";
import PhotoModal from "../extra/PhotoPreview";

const DoctorUserProfile = () => {
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const socket = useContext(SocketContext);
  const [online, setOnline] = useState<boolean>(false);
  const [pdfModal, setPdfModal] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imgUrl,setImgUrl]=useState("")
  const [showPhotoPreview,setShowPhotoPreview]=useState(false)

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiObject: any) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const fetchAppointmentData = useCallback(async () => {
    const response = await instance.get(`/appointments/${id}`);
    if (response.data.success) {
      setAppointmentDetails(response.data.detail);
      setMessages(response.data.messages);
    }
  }, [id]);

  useEffect(() => {
    fetchAppointmentData();
  }, [fetchAppointmentData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (appointmentDetails) {
        socket?.emit("check-online-status", {
          from: appointmentDetails?.docId,
          user: appointmentDetails?.userId,
        });
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [appointmentDetails, socket]);

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

  useEffect(() => {
    const handleOnlineStatus = (data: { status: boolean }) => {
      setOnline(data.status);
    };

    socket?.on("check-online-status", handleOnlineStatus);

    return () => {
      socket?.off("check-online-status", handleOnlineStatus);
    };
  }, [socket]);

  useEffect(() => {
    if (socket && id) {
      socket.emit("join_appointment", { appointmentId: id });

      socket.on("receive_message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      socket?.off("receive_message");
    };
  }, [id, socket]);

  const sendMessage = () => {
    if (!newMessage.trim()) {
      return toast.error("type a message", {
        richColors: true,
        duration: 1500,
      });
    }
    socket?.emit("send_message", {
      appointmentId: id,
      sender: "doctor",
      message: newMessage,
      type: "txt",
    });
    socket?.emit("send_notification", {
      receiverId: appointmentDetails?.userId,
      content: `You  have received a message from Dr ${appointmentDetails?.docName}`,
      appointmentId: id,
      type: "message",
    });

    setNewMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setImageFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setImagePreview(base64Image);
      };
      reader.readAsDataURL(selectedFile);

      setShowModal(true);
    }
  };
  const handleSendImage = async () => {
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
        setLoading(true);

        const response = await imageInstance.put(
          `/${id}/${"doctor"}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (response.data.success) {
          const imageUrl = response.data.url;
          socket?.emit("send_message", {
            appointmentId: id,
            sender: "doctor",
            message: imageUrl,
            type: "img",
          });
          setShowModal(false);
          setImageFile(null);
          setImagePreview(null);
        }
      } catch (error) {
        setShowModal(false);
        setImageFile(null);
        setImagePreview(null);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="px-16 py-3 ">
      <div className="p-8 bg-white shadow mt-24 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0"></div>
          <div className="relative">
            <div className="w-48  h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
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
              <span
                className={`absolute  top-36 right-3 w-6 h-6 ${
                  online ? "bg-green-500" : "bg-red-500"
                }  border-2 border-white rounded-full`}
              ></span>
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
                className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                onClick={() => {
                  //   const appointmentDate=new Date(appointmentDetails?.date)
                  //   const today=new Date()
                  //  if (
                  //    appointmentDate.getFullYear() !== today.getFullYear() ||
                  //    appointmentDate.getMonth() !== today.getMonth() ||
                  //    appointmentDate.getDate() !== today.getDate()
                  //  ) {
                  //    return toast.error("Not the appointment date", {
                  //      richColors: true,
                  //      duration: 1500,
                  //    });
                  //  }
                  navigate(
                    `/doctor/videocall/${id}/${appointmentDetails.docId}/${
                      appointmentDetails?.userId
                    }/${"doctor"}`,
                    { state: { img: appointmentDetails?.image } }
                  );
                }}
              >
                Start Consultation
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

        <div className="mt-20 text-center  pb-3">
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
          <div className="flex flex-col items-center">
            {appointmentDetails?.status === "completed" &&
              appointmentDetails?.review && (
                <div className="mt-4 text-center">
                  <span className="block text-lg font-medium text-gray-700">
                    User Rating:
                  </span>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    {Array.from({
                      length: appointmentDetails?.review.rating,
                    })?.map((_, index) => (
                      <svg
                        key={index}
                        className="text-yellow-500 w-5 h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  {appointmentDetails?.review.description && (
                    <span className="mt-2 block text-gray-600">
                      {appointmentDetails?.review?.description || ""}
                    </span>
                  )}
                </div>
              )}
          </div>
        </div>

        {appointmentDetails?.status === "completed" && (
          <div className="border-t-2 pt-4 ">
            {/* message */}

            <div className="flex flex-col mt-5 md:mt-0 flex-shrink-0 rounded-2xl bg-[#081f36] h-[280px] md:h-[500px] w-full p-4">
              <div className="flex flex-col h-full overflow-x-auto mb-4">
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-12 gap-y-2">
                    {messages?.map((msg: any, index: any) =>
                      msg.sender === "user" ? (
                        <div
                          key={index}
                          className="col-start-1 col-end-8 p-3 rounded-lg"
                        >
                          <div className="flex flex-row items-center">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                              <img
                                className="rounded-full"
                                src={
                                  appointmentDetails?.image ||
                                  "https://photosbull.com/wp-content/uploads/2024/05/no-dp_16.webp"
                                }
                                alt="noimg"
                              />
                            </div>
                            <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                              {msg.type === "img" ? (
                                <img
                                  onClick={() => {
                                    setImgUrl(msg.message);
                                    setShowPhotoPreview(true);
                                  }}
                                  src={msg.message}
                                  alt="Sent image"
                                  className="w-48 h-48 object-cover rounded-lg"
                                />
                              ) : (
                                <div>{msg.message}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={index}
                          className="col-start-6 col-end-13 p-3 rounded-lg"
                        >
                          <div className="flex items-center justify-start flex-row-reverse">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                              Me
                            </div>
                            <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                              {msg.type === "img" ? (
                                <img
                                  onClick={() => {
                                    setImgUrl(msg.message);
                                    setShowPhotoPreview(true);
                                  }}
                                  src={msg.message}
                                  alt="Sent image"
                                  className="w-48 h-48 object-cover rounded-lg"
                                />
                              ) : (
                                <div>{msg.message}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    <div ref={messagesEndRef}></div>
                  </div>
                </div>
              </div>
              <div className="relative flex flex-row items-center h-16 rounded-xl bg-[#3a5e81] w-full px-4">
                <label
                  htmlFor="fileInput"
                  className="flex items-center justify-center h-full w-12 text-gray-400 hover:text-white transition-colors duration-300 ease-in-out transform hover:scale-110 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faPaperclip} />
                </label>

                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                <div className="flex-grow ml-4">
                  <div className="relative w-full">
                    <input
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                    />

                    <button
                      onClick={() => setShowEmojiPicker((prev) => !prev)}
                      className="absolute flex items-center justify-center h-full w-12 right-12 top-0 text-gray-400 hover:text-gray-600"
                    >
                      <FontAwesomeIcon icon={faSmile} />
                    </button>

                    <button
                      onClick={sendMessage}
                      className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </button>

                    {showEmojiPicker && (
                      <div className="absolute bottom-12 right-0 z-50 bg-white shadow-lg rounded-lg">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <span className="block p-2 my-3  bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800 text-sm font-medium">
              <FontAwesomeIcon className="mr-2" icon={faCircleExclamation} />
              Chatting is only available for 2 days from the day of the
              appointment.
            </span>

            {/* message */}
          </div>
        )}
        {/* "modal" */}
        {showModal && (
          <ImagePreviewSendTime
            loading={loading}
            imagePreview={imagePreview as string}
            setShowModal={setShowModal}
            handleSendImage={handleSendImage}
            side="doctor"
          />
        )}

        {showPhotoPreview && (
          <PhotoModal
            imageUrl={imgUrl}
            closeModal={() => setShowPhotoPreview(false)}
          />
        )}
        {/* modal */}

        <div className="mt-3 border-t-2 flex flex-col justify-center">
          <p className="text-gray-600 pt-3 text-3xl mb-3 text-center font-bold lg:px-16">
            Medical Records
          </p>
          {appointmentDetails?.medicalRecords.length === 0 ? (
            <span className="text-indigo-500 text-center  py-2 px-4 font-medium mt-4">
              no records provided
            </span>
          ) : (
            <div className="flex justify-center">
              <div className="flex gap-3 overflow-x-auto p-3 justify-center items-center rounded-lg bg-gray-100 shadow-md max-w-fit">
                {appointmentDetails?.medicalRecords?.map(
                  (image: string, index: any) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-56 h-56 rounded-md overflow-hidden shadow-sm transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-md"
                    >
                      <img
                        src={image}
                        onClick={() => {
                          setImgUrl(image);
                          setShowPhotoPreview(true);
                        }}
                        alt={`Medical Record ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          )}
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
export default DoctorUserProfile;
