import { useState } from "react";
import moneyLogo from "@/assets/money2.png";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "sonner";
import instance from "../../Axios/doctorInstance";
import { AxiosError } from "axios";

const WithdrawalModal = ({
  closeModal,
  walletBalance,
  handleWithdrawalSuccess,
}: {
  closeModal: (status: boolean) => void;
  walletBalance: any;
  handleWithdrawalSuccess: () => void;
}) => {
  const [amount, setAmount] = useState<string>("");
  const handleWithdraw = async () => {
    const numericAmount = parseFloat(amount);

    if (isNaN(numericAmount)) {
      return toast.error("Please enter a valid number", {
        richColors: true,
        duration: 1500,
      });
    }

    if (numericAmount <= 0) {
      return toast.error("Amount must be greater than zero", {
        richColors: true,
        duration: 1500,
      });
    }

    if (numericAmount > walletBalance) {
      return toast.error("Amount exceeds wallet balance", {
        richColors: true,
        duration: 1500,
      });
    }
    if (numericAmount < 1000) {
      return toast.error("You should have a minimum balance of 1000", {
        richColors: true,
        duration: 1500,
      });
    }

    try {
      const response = await instance.post(`/wallet/withdraw/${amount}`);
      if (response.data.success) {
        toast.success(response.data.message, {
          richColors: true,
          duration: 1500,
        });
        closeModal(false);
        handleWithdrawalSuccess();
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message, {
          richColors: true,
          duration: 1500,
        });
      }
    }
  };
  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-gray-800">
        <button
          onClick={() => setAmount("")}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <FontAwesomeIcon
            onClick={() => closeModal(false)}
            icon={faCircleXmark}
            className="w-5 h-5"
          />
        </button>
        <div className="flex flex-col items-center">
          <img className="h-20 mb-4" src={moneyLogo} alt="Money" />
          <div className="relative w-full mb-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
              ₹
            </span>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 pl-8 text-center rounded-xl border  border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-700"
              placeholder="Enter Amount"
            />
          </div>
          <button
            onClick={handleWithdraw}
            className="w-full px-4 py-2 font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 "
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
};
export default WithdrawalModal;
