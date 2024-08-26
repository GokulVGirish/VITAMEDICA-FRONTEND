import React, {
  MutableRefObject,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DoctorFilterSort from "./DoctorFilterSort";
import instance from "../../Axios/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import logo from "@/assets/logoVerified.png";
import rating from "@/assets/rating.png";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export type Doctor = {
  _id: string;
  name: string;
  image: string;
  degree: string;
  fees: string;
  description: string;
  averageRating: number;
  totalReviews:number
  department: { _id: string; name: string };
};

const DoctorsList = () => {
  const [doctors, setDoctors] = useState<Doctor[] | null>(null);
  const [searchResult, setSearchResult] =
    useState<{ _id: number; name: string; image: string }[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<{name: string;_id: number;}>({ name: "All Departments", _id: 453 });
  const searchBarRef = useRef<HTMLInputElement | null>();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); 

  console.log("current pages", currentPage, "totalpages", totalPages);

  useEffect(() => {
    const getDoctors = async () => {
      try {
        setLoading(true); 
        const response = await instance.get(
          `/doctors/list?page=${currentPage}&limit=6`
        );
        if (response.data.success) {
          console.log("data of doctor", response.data.doctors);
          setDoctors(response.data.doctors);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data.message, {
            richColors: true,
            duration: 1500,
          });
        } else {
          toast.error("Unknown error", {
            richColors: true,
            duration: 1500,
          });
        }
      } finally {
        setLoading(false);
      }
    };
    if (selectedCategory.name === "All Departments") {
      getDoctors();
    } else {
      const categoryFilter = async () => {
        setLoading(true); 
        const response = await instance.get(
          `/doctors/category?category=${selectedCategory._id}&page=${currentPage}&limit=6`
        );
        if (response.data.success) {
          console.log("data of doctor", response.data.doctors);
          setDoctors(response.data.doctors);
          setTotalPages(response.data.totalPages);
        }
        setLoading(false);
      };
      categoryFilter();
    }
  }, [currentPage, selectedCategory]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleSearchChange = async () => {
    const searchValue = searchBarRef.current?.value || "";
    setSearchTerm(searchValue);
    if (searchValue.trim() === "") {
      setSearchResult([]);
    } else {
      try {
        const response = await instance.get(
          `/doctors/search?search=${searchValue}`
        );
        console.log("search response", response.data);
        setSearchResult(response.data.doctors);
      } catch (error) {
        console.error("Error fetching search results", error);
      }
    }
  };
  console.log("search term", searchTerm);

  const doctorDetails = useMemo(
    () =>
      loading
        ?
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-72">
              <Skeleton height={200} />
              <Skeleton count={5} className="my-2" />
            </div>
          ))
        : doctors?.map((doctor) => {
            return (
              <div
                key={doctor._id}
                className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
              >
                <span>
                  <img
                    onClick={() => navigate(`/doctorDetail/${doctor._id}`)}
                    src={
                      doctor.image ||
                      "https://static.vecteezy.com/system/resources/thumbnails/022/014/063/small_2x/missing-picture-page-for-website-design-or-mobile-app-design-no-image-available-icon-vector.jpg"
                    }
                    alt="Product"
                    className="h-70 w-58 object-cover rounded-t-xl"
                    loading="lazy"
                  />
                  <div className="px-4 justify-between py-3 w-72">
                    <p
                      onClick={() => navigate(`/doctorDetail/${doctor._id}`)}
                      className="text-3xl mt-3 text-center space-x-2 cursor-pointer font-bold text-black truncate block capitalize"
                    >
                      Dr {doctor.name}
                    </p>
                    <p
                      onClick={() => navigate(`/doctorDetail/${doctor._id}`)}
                      className="text-xs overflow-hidden mt-3 text-center space-x-2 font-bold text-black truncate block capitalize"
                    >
                      {doctor.degree}
                    </p>
                    <p className="text-sm text-gray-600 ml-9 w-44 pt-3 cursor-auto ">
                      <img src={logo} alt="none" />
                    </p>
                    <div className="flex justify-around items-center">
                      <p className="text-lg text-center font-semibold text-black cursor-auto my-2">
                        {doctor.department.name}
                      </p>
                      <p
                        onClick={() => navigate(`/doctorDetail/${doctor._id}`)}
                        className="text-sm text-gray-600 cursor-auto ml-2"
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
                            <h4 className="text-sm ml-2 ">({doctor?.totalReviews||0} reviews)</h4>
                          </span>
                        </div>
                      </p>
                    </div>
                  </div>
                </span>
              </div>
            );
          }),
    [doctors, loading]
  );

  return (
    <div>
      <DoctorFilterSort
        searchResult={
          searchResult as { _id: number; name: string; image: string }[]
        }
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        searchBarRef={searchBarRef as RefObject<HTMLInputElement>}
        selctedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      {doctors?.length === 0 && !loading && (
        <div className="flex justify-center mt-16">
          <h1 className="text-2xl md:text-3xl pl-2 my-2 border-l-4 font-sans font-bold border-[#928EDE] dark:text-gray-400">
            No Doctors Available
          </h1>
        </div>
      )}
      <section
        id="Projects"
        className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-9"
      >
        {doctorDetails}
      </section>
      {/* Pagination */}
      <div className="flex justify-center mb-10">
        <div className="flex justify-between items-center gap-10">
          <button
            disabled={currentPage === 1}
            onClick={handlePreviousPage}
            className="inline-flex items-center border border-indigo-300 px-3 py-1.5 rounded-md text-indigo-500 hover:bg-indigo-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            <span className="ml-1 font-bold text-lg">Back</span>
          </button>
          <h1 className="text-indigo-500 font-bold">
            {currentPage} / {totalPages}
          </h1>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="inline-flex items-center border border-indigo-300 px-3 py-1.5 rounded-md text-indigo-500 hover:bg-indigo-50"
          >
            <span className="mr-1 font-bold text-lg">Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;
