import React, { ChangeEvent, useRef } from "react";
import { useCallback, useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import instance from "../../Axios/userInstance";
import moment from "moment";
import PdfViewer from "../extra/PdfViewer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "sonner";
import {
  faCircleExclamation,
  faCircleXmark,
  faCloudArrowUp,
  faFilePdf,
  faPaperclip,
  faPaperPlane,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import { AxiosError } from "axios";
import { SocketContext } from "../../socketio/SocketIo";
import imageInstance from "../../Axios/imageIntsance";
import ImagePreviewSendTime from "../extra/ImagePreviewSendTime";
import Spinner from "../extra/Spinner";
import { useAppSelector } from "../../Redux/hoocks";
import EmojiPicker from "emoji-picker-react";
import PhotoModal from "../extra/PhotoPreview";

const UserAppointmentDetail = () => {
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const [pdfModal, setPdfModal] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useContext(SocketContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isMedicalRecordUploaded, setIsMedicalRecordUploaded] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const[imgUrl,setImgUrl]=useState("")
  const [showPhotoPreview,setShowPhotoPreview]=useState(false)
  //  message
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  //message

  const medicalRecordsRef = useRef<HTMLInputElement | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiObject: any) => {
    setNewMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const fetchAppointmentDetail = useCallback(async () => {
    try {
      const response = await instance.get(`/appointments/${id}/detail`);
      if (response.data.success) {
        setAppointmentDetails(response.data.data);
        setMessages(response.data.messages);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
    }
  }, [id, isMedicalRecordUploaded]);
  useEffect(() => {
    fetchAppointmentDetail();
  }, [fetchAppointmentDetail]);

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
      sender: "user",
      message: newMessage,
      type: "txt",
    });

    socket?.emit("send_notification", {
      receiverId: appointmentDetails?.docId,
      content: `You  have received a message from ${user}`,
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
      reader.onloadend = () => setImagePreview(reader.result as string);
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
        const response = await imageInstance.put(`/${id}/${"user"}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.data.success) {
          const imageUrl = response.data.url;
          socket?.emit("send_message", {
            appointmentId: id,
            sender: "user",
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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    const selectedFiles = Array.from(files);

    if (selectedFiles.length + imageFiles.length > 3) {
      return toast.error("You can only upload a maximum of 3 images", {
        richColors: true,
        duration: 1500,
      });
    }

    const newImagePreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImageFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
  };
  const handleRemoveImage = (indx: number) => {
    const updatedFiles = imageFiles.filter((_, index) => index !== index);
    const updatedPreviews = imagePreviews.filter((_, index) => indx !== index);
    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };
  const handleMedicalRecordsUpload = async () => {
    if (imageFiles.length === 0)
      return toast.error("Add records", {
        richColors: true,
        duration: 1500,
      });
    const formData = new FormData();
    imageFiles.forEach((image) => {
      formData.append("medicalRecords", image);
    });
    try {
      setLoading(true);
      const response = await instance.post(
        `/appointments/medicalRecords/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        setLoading(false);

        setIsMedicalRecordUploaded(true);
        toast.success("success", { richColors: true, duration: 1500 });
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setImageFiles([]);
      setImagePreviews([]);
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
              <button className=" py-2 px-4 uppercase rounded text-white bg-yellow-300 hover:bg-yellow-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
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

        <div className="mt-20 text-center  pb-3">
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
            Amount Payed : {appointmentDetails?.amount}{" "}
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

        {appointmentDetails?.status === "completed" && (
          <div className=" border-t-2 pt-4">
            {/* message */}

            <div className="flex flex-col mt-2 md:mt-0 flex-shrink-0 rounded-2xl bg-[#081f36] h-[280px] md:h-[500px] w-full p-4">
              <div className="flex flex-col h-full overflow-x-auto mb-4">
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-12 gap-y-2">
                    {messages?.map((msg: any, index: any) =>
                      msg.sender === "doctor" ? (
                        <div
                          key={index}
                          className="col-start-1 col-end-8 p-3 rounded-lg"
                        >
                          <div className="flex flex-row items-center">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                              <img
                                className="rounded-full"
                                src={
                                  appointmentDetails?.docImage ||
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
                                  src={msg.message}
                                  onClick={() => {
                                    setImgUrl(msg.message);
                                    setShowPhotoPreview(true);
                                  }}
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
            <span className="block p-2 my-3 border-t  bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800 text-sm font-medium">
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
            side="user"
          />
        )}
        {/* modal */}

        <div className="mt-3 flex flex-col border-t-2 justify-center">
          <p className="text-gray-600 text-3xl pt-3 mb-3 text-center font-bold lg:px-16">
            Medical Records
          </p>
          {appointmentDetails?.medicalRecords.length === 0 ? (
            <button
              onClick={() => medicalRecordsRef.current?.click()}
              className="text-indigo-500 py-2 px-4 font-medium mt-4"
            >
              {imageFiles.length === 3
                ? ""
                : imageFiles.length > 0
                ? " add more records"
                : "add records"}
            </button>
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
          <input
            ref={medicalRecordsRef}
            type="file"
            multiple
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <div className="flex  justify-center space-x-4 overflow-x-auto py-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="h-32 w-32 object-cover rounded-lg shadow-md transition-transform duration-300 ease-in-out transform hover:scale-105"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-200 transition-colors"
                >
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    className="text-red-500"
                  />
                </button>
              </div>
            ))}
          </div>
          {imageFiles.length > 0 && (
            <div className="flex justify-center">
              <button
                onClick={handleMedicalRecordsUpload}
                className="inline-block px-4 py-2 bg-[#928EDE] text-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 hover:bg-[#8375d4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#928EDE]"
              >
                <FontAwesomeIcon icon={faCloudArrowUp} /> Upload
              </button>
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
      {loading && <Spinner isUser={true} />}
      {showPhotoPreview && (
        <PhotoModal
          imageUrl={imgUrl}
          closeModal={() => setShowPhotoPreview(false)}
        />
      )}
    </div>
  );
};
export default UserAppointmentDetail;
