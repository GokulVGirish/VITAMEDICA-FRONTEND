import { IoSend } from "react-icons/io5";
import { Hourglass } from "react-loader-spinner";
const ImagePreviewSendTime = ({
  imagePreview,
  setShowModal,
  handleSendImage,
  side,
  loading,
}: {
  imagePreview: string;
  setShowModal: (action: boolean) => void;
  handleSendImage: () => void;
  side: "user" | "doctor";
  loading: boolean;
}) => {
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded-lg w-80 max-w-full relative">
          <button
            onClick={() => setShowModal(false)}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
          <h2 className="text-lg font-bold mb-2">Preview Image</h2>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full mb-4 rounded"
            />
          )}
          <div className="flex justify-end items-center gap-3">
            {loading && (
              <Hourglass
                visible={true}
                height="22"
                width="22"
                ariaLabel="hourglass-loading"
                wrapperStyle={{}}
                wrapperClass=""
                colors={[side === "user" ? "#928EDE" : "#56aac6", "#72a1ed"]}
              />
            )}
            <button
              onClick={handleSendImage}
              className={`text-white ${
                side === "doctor" ? "bg-[#56aac6]" : "bg-[#928EDE]"
              } px-3 py-2 rounded-lg flex justify-center items-center font-bold shadow-lg transform transition-all tex duration-300 ease-in-out gap-3 hover:scale-110 hover:shadow-2xl`}
            >
              Send <IoSend size={20} className="text-black" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default ImagePreviewSendTime;
