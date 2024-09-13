

const PhotoModal = ({ imageUrl,closeModal }:{imageUrl:string,closeModal:()=>void}) => {
  
  return (
    <div className="relative">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md transition-opacity duration-300 ease-in-out">
        <div
          className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] transition-transform transform-gpu"
          style={{ maxHeight: "90vh", maxWidth: "90vw" }}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-red-600 shadow-lg transform transition-transform duration-200 hover:scale-125 z-20"
          >
            &#x2715;
          </button>

          <img
            src={imageUrl}
            alt="img"
            className="w-full h-full object-contain rounded-lg"
            style={{ maxHeight: "calc(100% - 4rem)" }} 
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
