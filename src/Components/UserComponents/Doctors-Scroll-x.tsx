import doctor2 from "@/assets/cover2.jpg";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Doctor } from "./UserDoctorsList";
import instance from "../../Axios/axios";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logoVerified.png";
import rating from "@/assets/rating.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleRight, faCircleLeft } from "@fortawesome/free-solid-svg-icons";

const DoctorsScrollX = () => {
  const [doctors, setDoctors] = useState<Doctor[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await instance.get(
        `/doctors/list?page=${currentPage}&limit=3`
      );
      if (response.data.success) {
        setDoctors(response.data.doctors);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error(error);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const doctorDetails = useMemo(
    () =>
      doctors?.map((doctor) => {
        return (
          <div
            key={doctor._id}
            className="w-72 bg-white shadow-md rounded-xl transition-transform duration-500 hover:scale-105 hover:shadow-xl"
          >
            <img
              onClick={() => navigate(`/doctorDetail/${doctor._id}`)}
              src={
                doctor.image ||
                "https://static.vecteezy.com/system/resources/thumbnails/022/014/063/small_2x/missing-picture-page-for-website-design-or-mobile-app-design-no-image-available-icon-vector.jpg"
              }
              alt="Product"
              className="h-70 w-58 object-cover rounded-t-xl transition-transform duration-500"
              loading="lazy"
            />
            <div className="px-4 py-3">
              <p
                onClick={() => navigate(`/doctorDetail/${doctor._id}`)}
                className="text-3xl mt-3 text-center cursor-pointer font-bold text-black truncate"
              >
                Dr {doctor.name}
              </p>
              <p
                onClick={() => navigate(`/doctorDetail/${doctor._id}`)}
                className="text-xs mt-3 text-center font-bold text-black truncate"
              >
                {doctor.degree}
              </p>
              <p className="text-sm flex justify-center text-gray-600 ml-8 pt-3">
                <img src={logo} alt="none" className="mr-7"  />
              </p>
              <div className="flex justify-around items-center">
                <p className="text-lg text-center font-semibold text-black my-2">
                  {doctor.department.name}
                </p>
                <p
                  onClick={() => navigate(`/doctorDetail/${doctor._id}`)}
                  className="text-sm text-gray-600 ml-2"
                >
                  <div className="flex justify-center sm:justify-start items-center">
                    <svg
                      className="text-yellow-500 w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    <span className="text-2xl flex items-center  font-semibold mr-2">
                      {doctor?.averageRating || 0}
                      <h4 className="text-sm ml-2 ">
                        ({doctor?.totalReviews || 0} reviews)
                      </h4>
                    </span>
                  </div>
                </p>
              </div>
            </div>
          </div>
        );
      }),
    [doctors, navigate]
  );

  return (
    <section className="flex flex-col justify-center max-w-[85vw] min-h-44 px-4 mx-auto sm:px-6">
      <div className="flex flex-wrap items-center justify-center mb-8">
        <h2 className="mr-10 text-4xl font-bold leading-none md:text-4xl">
          Our Doctors
        </h2>
      </div>

      <div className="flex items-center gap-10">
        <FontAwesomeIcon
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage((prevState) => prevState - 1);
            }
          }}
          className="h-11 transition-transform duration-300 ease-in-out transform hover:scale-125 cursor-pointer"
          icon={faCircleLeft}
        />
        <section
          id="Projects"
          className="w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-9 transition-opacity duration-500"
          style={{ opacity: doctors ? 1 : 0 }}
        >
          {doctorDetails}
        </section>
        <FontAwesomeIcon
          onClick={() => {
            if (currentPage < totalPages) {
              setCurrentPage((prevState) => prevState + 1);
            }
          }}
          className="h-11 transition-transform duration-300 ease-in-out transform hover:scale-125 cursor-pointer"
          icon={faCircleRight}
        />
      </div>
    </section>
  );
};

export default DoctorsScrollX;
