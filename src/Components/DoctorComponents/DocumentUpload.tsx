import React, { useState } from "react";
import { useAppSelector ,useAppDispatch} from "../../Redux/hoocks";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doctorDocumentUpload } from "../../Redux/doctorSlice";
import {  useNavigate } from "react-router-dom";
import Spinner from "../extra/Spinner";

const DoctorDocumentUpload: React.FC = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [preview1, setPreview1] = useState<string | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);
  const [file3, setFile3] = useState<File | null>(null);
  const [preview3, setPreview3] = useState<string | null>(null);
  const [file4, setFile4] = useState<File | null>(null);
  const [preview4, setPreview4] = useState<string | null>(null);
  const {docStatus,loading}=useAppSelector((state)=>state.doctor)
  const navigate=useNavigate()
  const dispatch=useAppDispatch()

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };
    const isImageFormatValid = (file: File) => {
      const validFormats = [
        "image/jpeg",
        "image/jpg",
        "image/bmp",
        "image/webp",
        "image/tiff",
      ];
      return validFormats.includes(file.type);
    };
     const isFileSizeValid = (file: File) => {
       const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
       return file.size <= maxSizeInBytes;
     };

    const handleSubmit = async() => {

      if (!file1 || !file2 || !file3 || !file4) {
           toast.error("Please upload all four images.", {
             position: "top-right",
             autoClose: 5000,
             hideProgressBar: false,
             closeOnClick: true,
             pauseOnHover: true,
             draggable: true,
             progress: undefined,
             theme: "colored",
             transition: Zoom,
           });
        return;
      }

      if (
        !isImageFormatValid(file1) ||
        !isImageFormatValid(file2) ||
        !isImageFormatValid(file3) ||
        !isImageFormatValid(file4)
      ) {
            toast.error(
              "Invalid image format. Please upload images in JPG, JPEG, BMP, WEBP, or TIFF formats.",
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Zoom,
              }
            );
        return;
      }
         if (
           !isFileSizeValid(file1) ||
           !isFileSizeValid(file2) ||
           !isFileSizeValid(file3) ||
           !isFileSizeValid(file4)
         ) {
        
              toast.error("File size must be less than 2 MB.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Zoom,
              });
           return;
         }
      const formData = new FormData();
      formData.append("images", file1);
      formData.append("images", file2);
      formData.append("images", file3);
      formData.append("images", file4);
      console.log("called")
      await dispatch(doctorDocumentUpload(formData))
      navigate("/doctor")
      
    };

  if(docStatus==="Pending"){
    return (
      <section className="container w-full mx-auto items-center pt-10 pb-32">
        <h1 className="text-center text-3xl font-bold mb-4">
          Upload necessary documents
        </h1>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Zoom}
        />
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden items-center">
          <div className="px-4 py-6 flex flex-wrap w-full">
            <div className="grid grid-cols-2 gap-6 w-full">
              <div className="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer">
                <input
                  id="upload1"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setFile1, setPreview1)}
                />
                <label htmlFor="upload1" className="cursor-pointer">
                  {preview1 ? (
                    <img
                      src={preview1}
                      className="max-h-48 rounded-lg mx-auto"
                      alt="Image preview"
                    />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-8 h-8 text-gray-700 mx-auto mb-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>
                      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                        Upload Certificate Image
                      </h5>
                      <p className="font-normal text-sm text-gray-400 md:px-6">
                        Choose photo size should be less than{" "}
                        <b className="text-gray-600">2mb</b>
                      </p>
                      <p className="font-normal text-sm text-gray-400 md:px-6">
                        and should be in{" "}
                        <b className="text-gray-600">JPG, PNG, or GIF</b>{" "}
                        format.
                      </p>
                    </>
                  )}
                  <span
                    id="filename"
                    className="text-gray-500 bg-gray-200 z-50"
                  >
                    {file1?.name || ""}
                  </span>
                </label>
              </div>

              <div className="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer">
                <input
                  id="upload2"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setFile2, setPreview2)}
                />
                <label htmlFor="upload2" className="cursor-pointer">
                  {preview2 ? (
                    <img
                      src={preview2}
                      className="max-h-48 rounded-lg mx-auto"
                      alt="Image preview"
                    />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-8 h-8 text-gray-700 mx-auto mb-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>
                      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                        Upload Qualification Image
                      </h5>
                      <p className="font-normal text-sm text-gray-400 md:px-6">
                        Choose photo size should be less than{" "}
                        <b className="text-gray-600">2mb</b>
                      </p>
                      <p className="font-normal text-sm text-gray-400 md:px-6">
                        and should be in{" "}
                        <b className="text-gray-600">JPG, PNG, or GIF</b>{" "}
                        format.
                      </p>
                    </>
                  )}
                  <span
                    id="filename"
                    className="text-gray-500 bg-gray-200 z-50"
                  >
                    {file2?.name || ""}
                  </span>
                </label>
              </div>

              <div className="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer">
                <input
                  id="upload3"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setFile3, setPreview3)}
                />
                <label htmlFor="upload3" className="cursor-pointer">
                  {preview3 ? (
                    <img
                      src={preview3}
                      className="max-h-48 rounded-lg mx-auto"
                      alt="Image preview"
                    />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-8 h-8 text-gray-700 mx-auto mb-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>
                      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                        Aadar Front Image
                      </h5>
                      <p className="font-normal text-sm text-gray-400 md:px-6">
                        Choose photo size should be less than{" "}
                        <b className="text-gray-600">2mb</b>
                      </p>
                      <p className="font-normal text-sm text-gray-400 md:px-6">
                        and should be in{" "}
                        <b className="text-gray-600">JPG, PNG, or GIF</b>{" "}
                        format.
                      </p>
                    </>
                  )}
                  <span
                    id="filename"
                    className="text-gray-500 bg-gray-200 z-50"
                  >
                    {file3?.name || ""}
                  </span>
                </label>
              </div>

              <div className="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer">
                <input
                  id="upload4"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setFile4, setPreview4)}
                />
                <label htmlFor="upload4" className="cursor-pointer">
                  {preview4 ? (
                    <img
                      src={preview4}
                      className="max-h-48 rounded-lg mx-auto"
                      alt="Image preview"
                    />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-8 h-8 text-gray-700 mx-auto mb-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>
                      <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                        Aadar Back Image
                      </h5>
                      <p className="font-normal text-sm text-gray-400 md:px-6">
                        Choose photo size should be less than{" "}
                        <b className="text-gray-600">2mb</b>
                      </p>
                      <p className="font-normal text-sm text-gray-400 md:px-6">
                        and should be in{" "}
                        <b className="text-gray-600">JPG, PNG, or GIF</b>{" "}
                        format.
                      </p>
                    </>
                  )}
                  <span
                    id="filename"
                    className="text-gray-500 bg-gray-200 z-50"
                  >
                    {file4?.name || ""}
                  </span>
                </label>
              </div>
            </div>
            <div className="flex justify-center w-full">
              <button
                onClick={handleSubmit}
                className="bg-black text-white px-4 py-3 rounded-lg"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
        {loading && <Spinner />}
      </section>
    );
 
  }
    if(docStatus==="Submitted"){
        return (
            <>
            <h1>Document has been submitted and yet to be verified</h1>
            </>
        )
     }
     if(docStatus==="verified"){
        return (
             <>
           <h1>Verified Doctor</h1>
         </>
        )

     }
};

export default DoctorDocumentUpload;

