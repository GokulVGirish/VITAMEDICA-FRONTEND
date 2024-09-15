import doctor from "@/assets/cover4.jpg";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import instance from "../../Axios/userInstance";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const [searchResult, setSearchResult] = useState<
    { _id: number; name: string; image: string }[]
  >([]);
  const searchBarRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const dropDownRef = useRef<HTMLDivElement | null>(null);

  const handleSearchChange = async () => {
    const searchValue = searchBarRef.current?.value || "";
    if (searchValue.trim() === "") {
      setSearchResult([]);
    } else {
      try {
        const response = await instance.get(
          `/doctors/search?search=${searchValue}`
        );

        setSearchResult(response.data.doctors);
      } catch (error) {
        console.error("Error fetching search results", error);
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropDownRef.current &&
      !dropDownRef.current.contains(event.target as Node) &&
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target as Node)
    ) {
      setSearchResult([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <section
        className="relative bg-cover bg-center shadow-lg  bg-no-repeat"
        style={{ backgroundImage: `url(${doctor})` }}
      >
        <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
          <motion.div
            className="max-w-xl text-center p-6 rounded-3xl  bg-opacity-5   sm:text-left transform transition duration-500 hover:scale-105"
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            <h1 className="text-3xl font-extrabold rounded-lg text-white sm:text-5xl">
              Discover your{" "}
              <strong className="block text-[#928EDE]">Perfect Doctor</strong>{" "}
              Today
            </h1>

            <p className="mt-4 sm:mt-6 max-w-lg text-base sm:text-xl rounded-lg text-white font-semibold  italic">
              "Your wellness journey begins here. Connect with top doctors, book
              appointments, and unlock a healthier, brighter future."
            </p>

            <div className="mt-8 relative flex flex-col gap-2 justify-center md:justify-start">
              <input
                type="text"
                placeholder="Search Doctors..."
                ref={searchBarRef}
                onChange={handleSearchChange}
                className="md:w-2/3 sm:3/4 bg-white px-4 py-3 text-base text-black rounded-full shadow-lg border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-[#928EDE] transition duration-300 hover:ring-2 hover:ring-[#928EDE]"
              />
              {searchResult?.length! > 0 && (
                <div
                  ref={dropDownRef}
                  className="absolute top-full left-0 w-full mt-2 bg-white bg-opacity-70 backdrop-blur-md border border-gray-300 rounded-xl shadow-lg z-30 dark:bg-gray-800 dark:border-gray-600"
                >
                  <ul className="max-h-60 overflow-y-auto text-base text-gray-700 dark:text-gray-200">
                    {searchResult?.map((doctor) => (
                      <li
                        key={doctor._id}
                        onClick={() => navigate(`/doctorDetail/${doctor._id}`)}
                      >
                        <div className="flex items-center px-3 py-2 rounded-lg hover:bg-[#f3f4f6] dark:hover:bg-gray-700 cursor-pointer transition duration-200">
                          <img
                            className="h-10 w-10 rounded-full shadow-md"
                            src={
                              doctor.image ||
                              "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/fd35c-no-user-image-icon-27.png?fit=500%2C500&ssl=1"
                            }
                            alt={doctor.name}
                          />
                          <span className="ml-3 font-semibold text-lg">
                            {doctor.name}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Banner;
