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
  const dropDownRef=useRef<HTMLDivElement|null>(null)


  const handleSearchChange = async () => {
      
    const searchValue = searchBarRef.current?.value || "";
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



  useEffect(()=>{
    document.addEventListener("mousedown",handleClickOutside)

    return ()=>{
      document.removeEventListener('mousedown',handleClickOutside)


    }
  },[])



  return (
    <>
      <section
        className="relative bg-cover bg-center shadow-lg  bg-no-repeat"
        style={{ backgroundImage: `url(${doctor})` }}
      >
        <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8">
          <motion.div
            className="max-w-xl text-center p-4 rounded-md bg-opacity-50 sm:text-left"
            initial="hidden"
            animate="visible"
            variants={textVariants}
          >
            <h1 className="text-3xl font-extrabold rounded-lg text-white sm:text-5xl">
              Let us find your{" "}
              <strong className="block text-[#928EDE]">Doctor</strong>
            </h1>
            <p className="mt-4 sm:mt-6 max-w-lg text-sm sm:text-lg rounded-lg text-white font-semibold shadow-md">
              "Your health is our priority. Find your perfect doctor, book an
              appointment, and take the first step toward a healthier tomorrow."
            </p>

            <div className="mt-6 relative flex flex-col gap-0 justify-center sm:justify-start w-2/3 sm:w-1/2">
              <input
                type="text"
                placeholder="Search Doctors..."
                ref={searchBarRef}
                onChange={handleSearchChange}
                className="w-full bg-white px-4 py-2 text-sm text-black rounded-xl"
              />
              {searchResult?.length! > 0 && (
                <div
                  ref={dropDownRef}
                  className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-30 dark:bg-gray-700 dark:border-gray-600"
                >
                  <ul className="max-h-60 overflow-y-auto text-sm text-gray-700 dark:text-gray-200">
                    {searchResult?.map((doctor) => (
                      <li
                        key={doctor._id}
                        onClick={() => navigate(`/doctorDetail/${doctor._id}`)}
                      >
                        <div className="flex items-center px-2 py-1 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer">
                          <img
                            className="h-8 rounded-full"
                            src={
                              doctor.image ||
                              "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/fd35c-no-user-image-icon-27.png?fit=500%2C500&ssl=1"
                            }
                            alt={doctor.name}
                          />
                          <span className="ml-2">{doctor.name}</span>
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
