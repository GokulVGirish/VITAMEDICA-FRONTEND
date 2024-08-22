import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfViewer = ({
  closeModal,
  viewPdf,
}: {
  closeModal: () => void;
  viewPdf: string | null;
}) => {
  const newplugin = defaultLayoutPlugin();
  console.log("view pdf",viewPdf)

  return (
    <div
      className="relative z-30"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-transparent bg-opacity-75 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center px-2 py-12 text-center">
          <div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl  text-slate-100 text-left shadow-xl transition-all">
            <div className="px-5 py-4">
              <button
                type="button"
                className="rounded-md p-1 inline-flex items-center justify-center text-gray-700  focus:outline-none absolute top-2 right-2"
                onClick={closeModal}
              >
                <span className="sr-only">Close menu</span>
                <FontAwesomeIcon size="2x" icon={faCircleXmark} />
              </button>
            </div>
            <div className="px-4 py-4">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                {viewPdf ? (
                  <Viewer fileUrl={viewPdf} plugins={[newplugin]} />
                ) : (
                  <p>No PDF</p>
                )}
              </Worker>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
