import vitamedica from "@/assets/logoVerified.png";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import logo from "@/assets/cover1.jpg";
import { AxiosError } from "axios";
import instance from "../../Axios/userInstance";
import { Doctor } from "../../types/doctor";
import SlotBookingModal from "../extra/SlotBookingModal";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleLeft,
  faCircleRight,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { Review } from "../../types/review";

const UserDoctorDetail = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<{
    _id: string;
    name: string;
    email: string;
    averageRating: number;
    totalReviews: number;
    reviews: Review[];
  }>();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getDoctorDetail = async () => {
      try {
        const response = await instance.get(
          `/doctors/${id}/profile?page=${currentPage}&limit=3`
        );

        if (response.data.success) {
          setDoctor(response.data.doctor);
          setReviews(response.data.reviews);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          return toast.error(error.response?.data.message, {
            richColors: true,
            duration: 1500,
          });
        } else {
          return toast.error("unknown error", {
            richColors: true,
            duration: 1500,
          });
        }
      }
    };
    getDoctorDetail();
  }, [id]);
  const showMoreReviews = useCallback(async () => {
    try {
      const response = await instance.get(
        `/doctors/${id}/profile/reviews?page=${currentPage}&limit=3`
      );
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {}
  }, [currentPage]);
  useEffect(() => {
    showMoreReviews();
  }, [showMoreReviews]);

  return (
    <main
      style={{
        backgroundImage: `url(${logo})`,
        height: "50vh",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="profile-page pt-96"
    >
      <section className="relative block h-500-px">
        <div className="absolute bg-red-400 w-full h-full bg-center bg-cover">
          <span
            id="blackOverlay"
            className="w-full h-full absolute opacity-50 bg-black"
          ></span>
        </div>
        <div
          className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px"
          style={{ transform: "translateZ(0px)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <span className="text-blueGray-200 fill-current"></span>
          </svg>
        </div>
      </section>

      <section className="relative py-16 bg-blueGray-200">
        <div className="container mx-auto px-4">
          <motion.div
            className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="px-6 rounded-lg shadow-md">
              <div className="flex flex-wrap justify-center">
                <motion.div
                  className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className="mx-auto">
                    <img
                      alt="..."
                      src={
                        doctor?.image ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                      }
                      className="shadow-xl w-40 h-40 lg:w-32 lg:h-32 rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                    />
                  </div>
                </motion.div>
                <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                  <div className="py-6 px-3 mt-32 sm:mt-0">
                    <motion.button
                      onClick={() => setModalOpen(true)}
                      className="bg-[#928EDE] active:bg-pink-600 uppercase text-white font-bold hover:bg-[#7F7BD1] hover:scale-105 hover:shadow-lg shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Book Appointment
                    </motion.button>
                  </div>
                </div>
                <div className="w-full lg:w-4/12 px-4 lg:order-1"></div>
              </div>
              <div className="text-center mt-12">
                <motion.h3
                  className="text-4xl font-semibold leading-normal text-blueGray-700 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {doctor?.name}
                </motion.h3>
                <motion.div
                  className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                  {doctor?.degree}
                </motion.div>
                <motion.div
                  className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
                  {doctor?.department?.join(",")}
                </motion.div>
                <motion.div
                  className="mb-2 text-blueGray-600 mt-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <img className="h-20 mx-auto" src={vitamedica} />
                </motion.div>
              </div>
              <motion.div
                className="mt-10 py-10 border-t border-blueGray-200 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-9/12 px-4">
                    <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                      {doctor?.description}
                    </p>
                  </div>
                </div>
                {/* review */}
                <section className="bg-white px-4 pb-12 md:py-10">
                  <div className="max-w-screen-xl mx-auto">
                    <h2 className="font-black text-black text-center text-3xl leading-none uppercase max-w-2xl mx-auto mb-12">
                      What Patients Are Saying
                    </h2>
                    {/* new */}

                    <div className="mt-10 mb-6 pl-2 flex items-center justify-start gap-x-6">
                      <div className="hidden sm:block -space-x-2 overflow-hidden">
                        <FontAwesomeIcon className="h-10 w-10" icon={faUsers} />
                      </div>
                      <div className="border-none sm:border-l-2 border-black sm:pl-3">
                        <div className="flex justify-center sm:justify-start items-center">
                          <h3 className="text-2xl font-semibold mr-2">
                            {reviews?.averageRating}
                          </h3>
                          <svg
                            className="text-yellow-500 w-6 h-6"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm">
                            Rated by {reviews?.totalReviews || 0} on Vitamedica
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* new */}
                    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
                      {/* Testimonial 1 */}
                      {reviews?.reviews?.map((review) => {
                        return (
                          <div
                            key={review.userId}
                            className="bg-gray-200 rounded-lg p-8 text-center md:w-1/3"
                          >
                            <p className="text-xs mb-2">
                              Posted on{" "}
                              {moment(review?.createdAt).format("MMMM D, YYYY")}
                            </p>

                            <p className="font-bold uppercase">
                              {review.userName}
                            </p>
                            <p className="text-xl font-light italic text-gray-700">
                              {review.comment}
                            </p>
                            <div className="flex items-center justify-center space-x-2 mt-4">
                              {Array.from({ length: review.rating }).map(() => {
                                return (
                                  <svg
                                    className="text-yellow-500 w-5 h-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                  </svg>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {!reviews && (
                      <div className="flex justify-center">
                        <h3 className="text-center">No reviews yet</h3>
                      </div>
                    )}
                  </div>
                </section>
                {reviews && (
                  <div className=" flex items-end justify-center gap-6">
                    <FontAwesomeIcon
                      onClick={() => {
                        if (currentPage > 1) {
                          setCurrentPage((prevState) => prevState - 1);
                        }
                      }}
                      className="h-11 transition-transform duration-300 ease-in-out transform hover:scale-125 cursor-pointer"
                      icon={faCircleLeft}
                    />
                    <FontAwesomeIcon
                      onClick={() => {
                        if (currentPage < Math.ceil(reviews.totalReviews / 3)) {
                          setCurrentPage((prevState) => prevState + 1);
                        }
                      }}
                      className="h-11 transition-transform duration-300 ease-in-out transform hover:scale-125 cursor-pointer"
                      icon={faCircleRight}
                    />
                  </div>
                )}

                {/* review */}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {modalOpen && (
          <SlotBookingModal
            id={id as string}
            closeModal={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
};

export default UserDoctorDetail;
