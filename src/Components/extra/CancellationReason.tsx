


const BookingCancellationReason = ({
  setCancellationReasonModal,
  cancellationReason,
  setCancellationReason,
  handleCancel
}: {
  setCancellationReasonModal: (status: false) => void;
  cancellationReason: string;
  setCancellationReason: (reason: string) => void;
  handleCancel:()=>void
}) => {
  return (
    <div>
      <div
        id="hs-scale-animation-modal"
        className="fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-auto w-full h-full"
        role="dialog"
        aria-labelledby="hs-scale-animation-modal-label"
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full max-w-lg bg-white border shadow-sm rounded-xl">
            <div className="flex justify-between items-center py-3 px-4 border-b">
              <h3
                id="hs-scale-animation-modal-label"
                className="font-bold text-gray-800"
              >
              Cancel Appointment
              </h3>
              <button
                type="button"
                className="inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
                aria-label="Close"
                onClick={() => setCancellationReasonModal(false)}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-800">Reason for Cancellation</p>
              <input
                type="text"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="flex mt-5 items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl shadow-lg"
                placeholder="enter a reason"
              />
            </div>
            <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
              <button
                type="button"
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                onClick={()=>setCancellationReasonModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BookingCancellationReason