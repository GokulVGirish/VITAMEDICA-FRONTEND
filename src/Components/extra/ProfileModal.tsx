import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import ImageCropper from "./ImageCropper";
type PropsType = {
  closeModal(): void;
  setAvatar(url: string): void;
  side: "user" | "doctor";
};
const ProfileModal = ({ closeModal, setAvatar, side }: PropsType) => {
  return (
    <div
      className="relative"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true"
      style={{ zIndex: 80 }}
    >
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center px-2 py-12 text-center ">
          <div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-gray-800 text-slate-100 text-left shadow-xl transition-all">
            <div className="px-5 py-4">
              <button
                type="button"
                className="rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 focus:outline-none absolute top-2 right-2"
                onClick={closeModal}
              >
                <span className="sr-only">Close menu</span>
                <FontAwesomeIcon icon={faCircleXmark} />
              </button>
              <ImageCropper
                setAvatar={setAvatar}
                closeModal={closeModal}
                side={side}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfileModal;
