
import courage from "@/assets/courageDog.png";

const VideoPermissionModal=()=>{
  return (
    <div
      className="relative z-30"
      aria-labelledby="video-permission-dialog"
      role="dialog"
      aria-modal="true"
    >
     
      <div className="fixed inset-0 bg-gray-900 bg-opacity-80 pointer-events-none"></div>

   
      <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
        <div className="absolute top-72 left-72 pointer-events-auto">
          <img
            className="rounded-2xl h-96 "
            src={courage}
            alt="Courage the Cartoon"
          />
        </div>
      </div>
    </div>
  );
}
export default VideoPermissionModal