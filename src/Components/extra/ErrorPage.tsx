
import { useNavigate} from "react-router-dom";

const ErrorPage = (props:{side:"user"|"admin"|"doctor"}) => {
    const navigate=useNavigate()
    
  return (
     <div className="h-screen fixed top-0 left-0 z-50 w-screen bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="container max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-12 shadow-xl rounded-lg bg-white transform transition duration-300 hover:scale-105 hover:shadow-2xl">
        <div className="w-full lg:w-1/2 text-center md:text-left">
          <div className="text-8xl md:text-9xl font-extrabold text-green-500 mb-6">
            404
          </div>
          <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">
            Oops! The page you are looking for can't be found.
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">
            It seems you've hit a broken link or the page may have moved.
          </p>
          <span
            onClick={() =>
              navigate(props.side === "user" ? "/" : `/${props.side}`)
            }
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:ring-4 focus:ring-red-300 transition duration-300"
          >
            Take me home
          </span>
        </div>
        <div className="w-full lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
          <img
            src="https://user-images.githubusercontent.com/43953425/166269493-acd08ccb-4df3-4474-95c7-ad1034d3c070.svg"
            alt="404 Not Found"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
