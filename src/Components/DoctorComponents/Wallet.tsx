import { useEffect, useState } from "react";
import instance from "../../Axios/doctorInstance";
import moment from "moment";
import WithdrawalModal from "./WithdrawalModal";

const DoctorWallet = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showWithdrawalPopup, setWithdrawalPopup] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const limit = 10;
  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await instance.get(
          `/wallet?page=${page}&limit=${limit}`
        );
        if (response.data.success) {
          setWallet(response.data.walletDetail);
          setTransactions(response.data.walletDetail.transactions);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    fetchWallet();
  }, [page, refresh]);
  const handleWithdrawalSuccess = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <>
      <div className=" flex justify-start mt-4 ml-4">
        <div className="p-4 w-52  shadow-lg rounded-2xl bg-gray-700">
          <div className="flex items-center">
            <span className="relative px-4 py-2 rounded-full bg-purple-200 ">
              ₹
            </span>
            <p className="ml-2 text-black text-md dark:text-white">
              Wallet Balance
            </p>
          </div>
          <div className="flex flex-col justify-start">
            <p className="my-4 text-4xl font-bold text-left text-gray-700 dark:text-gray-100">
              {wallet?.balance || "00.00"}
              <span className="text-sm">₹</span>
            </p>
            <div
              onClick={() => setWithdrawalPopup(true)}
              className="flex items-center text-sm text-green-500"
            >
              <span className="text-gray-400 cursor-pointer px-3 py-2 border-2 rounded-lg">
                Withdraw
              </span>
            </div>
          </div>
        </div>
      </div>
      <section className="container px-4 mb-10 mt-7 mx-auto">
        <div className="flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y bg-[#56aac6]">
                  <thead className="bg-gradient-to-b from-[#56aac6] to-[#364f6b]">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-white"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-white"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-white"
                      >
                        Type
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-white"
                      >
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-gray-700">
                    {transactions &&
                      transactions.map((transaction: any) => {
                        return (
                          <tr className="" key={transaction?._id}>
                            <td className="border-t border-white px-4 py-4 text-sm text-white whitespace-nowrap">
                              {moment(transaction.date).format("MMMM D, YYYY")}
                            </td>
                            <td className="px-4 py-4 border-t border-white text-sm text-white whitespace-nowrap">
                              {transaction?.amount}
                            </td>
                            <td className="px-4 py-4 border-t border-white text-sm text-white whitespace-nowrap">
                              {transaction?.type}
                            </td>

                            <td className="px-4 py-4 border-t border-white text-sm text-white whitespace-nowrap">
                              {transaction?.reason}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                {!transactions && (
                  <div className="flex justify-center dark:bg-gray-900">
                    <span className="px-4 text-center py-4 text-sm text-white">
                      No Transactions
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className=" flex justify-center  mb-10 ">
        <div className="flex justify-between items-center  gap-10">
          <button
            disabled={page === 1}
            onClick={handlePrevPage}
            className="inline-flex items-center border border-[#364f6b] px-3 py-1.5 rounded-md text-[#364f6b] hover:bg-indigo-50"
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
          <h1 className=" text-[#364f6b] font-bold">
            {page} / {totalPages}
          </h1>

          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="inline-flex items-center border border-[#364f6b] px-3 py-1.5 rounded-md text-[#364f6b] hover:bg-indigo-50"
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
        {showWithdrawalPopup && (
          <WithdrawalModal
            walletBalance={wallet?.balance}
            closeModal={setWithdrawalPopup}
            handleWithdrawalSuccess={handleWithdrawalSuccess}
          />
        )}
      </div>
    </>
  );
};
export default DoctorWallet;
