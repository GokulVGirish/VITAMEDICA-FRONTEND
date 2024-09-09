import userInstance from "../../Axios/userInstance";
import doctorInstance from "../../Axios/doctorInstance";
import { useCallback, useEffect, useState } from "react";
import  { AxiosError } from "axios";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBellSlash, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";
import { motion } from "framer-motion";


const NotificationComponent = ({
  notificationHandler,
  isUser,
  setNotificationCount,
}: {
  notificationHandler: (type: boolean) => void;
  isUser: boolean;
  setNotificationCount: (count: number) => void;
}) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [disappearingNotifications, setDisappearingNotifications] = useState<
    string[]
  >([]);
  const navigate = useNavigate();
  const axiosInstance = isUser ? userInstance : doctorInstance;

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/profile/notifications`);
      setNotifications(response.data.notifications);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
      }
    }
  }, [axiosInstance]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async () => {
    try {
      const response = await axiosInstance.put(
        `/profile/notifications/mark-as-read`
      );
      if (response.data.success) {
        setNotificationCount(0);
        handleDisappearAnimation();
     
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisappearAnimation = () => {
    notifications.forEach((notification, index) => {
      setTimeout(() => {
        setDisappearingNotifications((prev) => [...prev, notification._id]);
        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((n) => n._id !== notification._id)
          );
        }, 700);
      }, index * 200);
    });
  };

  return (
    <motion.div
      className="w-full h-full fixed top-0 right-0 bg-gray-800 bg-opacity-90 z-40 overflow-y-auto"
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: "0%" }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full h-full flex justify-end">
        <motion.div
          className="2xl:w-4/12 bg-white h-screen overflow-y-auto p-8 shadow-lg rounded-l-xl"
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <p className="text-2xl font-semibold text-gray-800">
              Notifications
            </p>

            {notifications.length > 0 && (
              <span
                onClick={() => markAsRead()}
                className={`cursor-pointer px-3 py-1.5 flex items-center gap-2 rounded-full text-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  isUser
                    ? "bg-gradient-to-r from-[#928EDE] to-[#817BBE]"
                    : "bg-gradient-to-r from-[#56aac6] to-[#4b99b5]"
                }`}
                title="Mark as Read"
              >
                <IoEyeSharp className="text-lg" />
                <span className="font-medium text-sm tracking-wide">
                  Mark as Read
                </span>
              </span>
            )}

            <button
              aria-label="close modal"
              className="focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-full p-2 cursor-pointer"
              onClick={() => notificationHandler(false)}
            >
              <svg width="24" height="24" fill="none">
                <path
                  d="M18 6L6 18"
                  stroke="#4B5563"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="#4B5563"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <FontAwesomeIcon
                className="text-gray-400 text-6xl mb-4"
                icon={faBellSlash}
              />
              <p className="text-lg text-gray-500 font-medium">
                No notifications
              </p>
              <p className="text-sm text-gray-400 mt-1">
                You're all caught up!
              </p>
            </div>
          ) : (
            notifications.map((notification: any) => (
              <motion.div
                key={notification._id}
                className={`w-full p-4 mb-4 bg-white rounded-lg shadow-sm flex items-center transition-transform duration-300 ease-in-out ${
                  disappearingNotifications.includes(notification._id)
                    ? "opacity-0 translate-y-4 scale-95"
                    : "opacity-100 translate-y-0 scale-100"
                }`}
                initial={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: 10 }}
              >
                <div className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center bg-gray-100">
                  <FontAwesomeIcon
                    className="text-[#EF4444]"
                    icon={faCommentDots}
                  />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-800">
                    {notification.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {moment(notification.createdAt).format("MMMM D, h:mm A")}
                  </p>
                  <p
                    onClick={() => {
                      if (isUser) {
                        navigate(
                          `/profile/appointmentDetail/${notification.appointmentId}`
                        );
                      } else {
                        navigate(
                          `/doctor/userProfile/${notification.appointmentId}`
                        );
                      }
                      notificationHandler(false);
                    }}
                    className="text-xs cursor-pointer text-blue-500 mt-2 hover:underline"
                  >
                    Click to view
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </motion.div>
  );

};

export default NotificationComponent;