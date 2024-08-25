import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { User } from "./UserListing";
import adminInstance from "../../Axios/adminInstance";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AxiosError } from "axios";

const UnverifiefDoctorsList=()=>{
    const [doctors, setDoctors] = useState<any[]>([]);
    const navigate=useNavigate()
    useEffect(()=>{
        const getDoctors=async()=>{
            try{
                const response = await adminInstance.get("/doctors/unverified");
                if(response.data.success){
                    setDoctors(response.data.doctors)
                    console.log("response is", response.data.doctors);
                }

            }
            catch(error){
                if(error instanceof AxiosError){
                    console.log(error.response)
                }

            }
        }
        getDoctors()

    },[])

    return (
      <div className="">
        <div className=" flex justify-center items-center">
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
          <div className="w-full max-w-4xl">
            <div className="text-center my-4">
              <h1 className="text-2xl font-bold">Doctors Verification</h1>{" "}
            </div>

            <div>
              <br />
            </div>

            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
              <thead className="bg-[#56aac6] text-white">
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors &&
                  doctors.map((doctor) => (
                    <tr
                      key={doctor._id}
                      className="hover:bg-gray-100 transition-all"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {doctor.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {doctor.department.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            navigate(`/admin/verifyDoctorDetail/${doctor._id}`)
                          }
                          className={`mr-2  bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded-full`}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {doctors.length === 0 && (
              <div className=" flex  min-w-full h-10 font-bold shadow-lg text-white px-5 items-center justify-center  bg-gray-700 rounded-lg ">
                No Doctors To Verify
              </div>
            )}
          </div>
        </div>
      </div>
    );
}
export default UnverifiefDoctorsList