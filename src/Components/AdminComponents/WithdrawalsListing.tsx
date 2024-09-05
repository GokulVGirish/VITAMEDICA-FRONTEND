import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {toast} from "sonner"
import adminInstance from "../../Axios/adminInstance";

const WithdrawalListing = () => {
  const [withdrawalList, setWithdrawalList] = useState<{_id:number,name:string,email:string,date:Date,amount:number}[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchClicked, setSearchClicked] = useState(false);
    const fetchWithdrawalList=useCallback(async()=>{
           const params = {
             page,
             limit: 10,
             ...(startDate && { startDate }),
             ...(endDate && { endDate }),
           };
        try{
            const response = await adminInstance.get("/payouts/withdrawals",{params});
            if(response.data.success){
                setWithdrawalList(response.data.withdrawalList)
                setTotalPages(response.data.count)

            }

        }
        catch(error){

        }

    },[page,searchClicked])
    
    useEffect(()=>{
        fetchWithdrawalList()

    },[fetchWithdrawalList])
  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevState) => prevState - 1);
    }
  };
  const handleNextPage = () => {
    if (page < Math.ceil(totalPages / 10)) {
      setPage((prevState) => prevState + 1);
    }
  };
   const handleSearch = () => {
     if (!startDate || !endDate)
       return toast.error("Select a Start and End Date", {
         richColors: true,
         duration: 1500,
       });
     const start = new Date(startDate);
     const end = new Date(endDate);

     if (start > end) {
       setStartDate("");
       setEndDate("");
       return toast.error(
         "Start date should be less than or equal to end date.",
         { richColors: true, duration: 1500 }
       );
     }
     setPage(1);
     setSearchClicked(true);
   };
     const handleClear = () => {
       setStartDate("");
       setEndDate("");
       setPage(1);
       setSearchClicked(false);
     };

  return (
    <>
      <div className="mb-7 flex justify-center">
        {" "}
        <div className="w-full max-w-[75vw] mx-auto">
          {" "}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center my-4"
          >
            <h1 className="text-2xl text-center font-bold">Withdrawals</h1>
          </motion.div>
          {/* date search */}
          <div className="flex flex-col justify-center items-center mb-7">
            <div className="flex items-center mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </div>
                <input
                  name="start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-gray-50 cursor-pointer border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Select date start"
                />
              </div>
              <span className="mx-4 text-gray-500">to</span>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </div>
                <input
                  name="end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-gray-50 border cursor-pointer border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Select date end"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleSearch}
                className="py-1.5 px-3 rounded-lg text-sm font-medium text-white  dark:bg-gray-700 dark"
              >
                Search
              </button>
              <button
                onClick={handleClear}
                className={`py-1.5 px-3 rounded-lg ${
                  searchClicked ? "dark:bg-gray-700" : "dark:bg-gray-500"
                } text-sm font-medium text-white   dark`}
              >
                Clear
              </button>
            </div>
          </div>
          {/* date search */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <table className="min-w-full bg-white rounded-lg overflow-hidden  shadow-lg">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                    Date
                  </th>
                
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                    Doctor Name
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                    Amount
                  </th>
                
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {withdrawalList &&
                  withdrawalList.map((item: any) => (
                    <motion.tr
                      key={item._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-100 transition-all"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {moment(item?.date).format("MMMM D, YYYY")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {item?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {item?.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        ₹{item?.amount}
                      </td>
                     
                    </motion.tr>
                  ))}
              </tbody>
            </table>
            {withdrawalList?.length === 0 && (
              <div className="flex min-w-full h-10 font-bold shadow-lg text-white px-5 items-center justify-center bg-gray-800 rounded-lg">
                No Withdrawals Yet
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <div className="flex justify-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center gap-10"
        >
          <button
            disabled={page === 1}
            onClick={handlePrevPage}
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
            {page} / {Math.ceil(totalPages / 10)}
          </h1>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
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
        </motion.div>
      </div>
    </>
  );
};
export default WithdrawalListing;
