import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import instance from "../../Axios/doctorInstance";
import { useNavigate } from "react-router-dom";


const DoctorFilterSort = ({
  selctedCategory,
  setSelectedCategory,
  searchBarRef,
  searchTerm,
  handleSearchChange,
  searchResult,
  setSearchResult,
}: {
  selctedCategory: { _id: number; name: string };
  setSelectedCategory(category: { _id: number; name: string }): void;
  searchBarRef: RefObject<HTMLInputElement>;
  searchTerm: string;
  handleSearchChange: () => void;
  searchResult: { _id: number; name: string; image: string }[];
  setSearchResult:(data:any)=>void
}) => {
  const [departments, setDepartments] = useState<
    { name: string; _id: number }[]
  >([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const categoryDropDownRef = useRef<HTMLUListElement | null>(null);
  const searchDropdownRef = useRef<HTMLDivElement | null>(null);
  const getDepartments = useCallback(async () => {
    const response = await instance.get("/utility/departments");
    if (response.data.success) {
      setDepartments(response?.data?.departments);
    }
  }, []);
  useEffect(() => {
    getDepartments();
  }, [getDepartments]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCategorySelect = (category: { _id: number; name: string }) => {
    setSelectedCategory(category);
    setDropdownOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryDropDownRef.current &&
        !categoryDropDownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }

      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(e.target as Node)
      ) {
        setSearchResult([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setDropdownOpen, setSearchResult]);


  return (
    <form className="max-w-lg mx-auto mt-12">
      <div className="flex">
        <button
          id="dropdown-button"
          onClick={toggleDropdown}
          className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-[#928EDE] border rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100  dark:hover:bg-gray-600 dark:text-white border-[#7d78e0]"
          type="button"
        >
          {selctedCategory.name}
          <svg
            className="w-2.5 h-2.5 ms-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
        {dropdownOpen && (
          <div
            id="dropdown"
            className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute"
          >
            <ul
              ref={categoryDropDownRef}
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdown-button"
            >
              {[{ name: "All Departments", _id: 345 }, ...departments]?.map(
                (category) => (
                  <li key={category._id}>
                    <button
                      type="button"
                      className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category.name}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
        <div className="relative w-full">
          <input
            type="search"
            ref={searchBarRef}
            className="block p-2.5 w-full z-20 py-3 px-4 text-sm  text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300   dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
            placeholder="Search Doctors..."
            value={searchTerm}
            onChange={handleSearchChange}
            required
          />
          {searchResult?.length > 0 && (
            <div
              ref={searchDropdownRef}
              className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-30 dark:bg-gray-700 dark:border-gray-600"
            >
              <ul className="max-h-60 overflow-y-auto text-sm text-gray-700 dark:text-gray-200">
                {searchResult.map((doctor) => (
                  <li
                    key={doctor._id}
                    onClick={() => navigate(`/doctorDetail/${doctor._id}`)}
                  >
                    <div className=" flex items-center px-2 pb-1 hover:rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      <img
                        className="h-8 rounded-full"
                        src={
                          doctor.image ||
                          "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/fd35c-no-user-image-icon-27.png?fit=500%2C500&ssl=1"
                        }
                        alt="noImg"
                      />
                      <button
                        type="button"
                        className="block px-4 py-2 w-full text-left  "
                        onClick={() =>
                          handleCategorySelect({
                            _id: doctor._id,
                            name: doctor.name,
                          })
                        }
                      >
                        {doctor.name}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default DoctorFilterSort
