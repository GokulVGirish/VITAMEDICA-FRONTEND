import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AxiosError } from "axios";
import { useState ,useEffect} from "react";
import adminInstance from "../../Axios/adminInstance";

const DoctorListing = () => {
    const [doctors,setDoctors]=useState<any[]>()
    const [filteredDoctors,setFilteredDoctors]=useState<any[]>([])
    const [filter,setFilter]=useState<"all"|"blocked"|"unblocked">("all")
     useEffect(() => {
       const getUsers = async () => {
         const response = await adminInstance.get("/doctors");
         if (response.data.success) {
           setDoctors(response.data.doctors);
           setFilteredDoctors(response.data.doctors);
         }
       };
       getUsers();
     }, []);
    const handleBlockUnblock=async(id:string,status:boolean)=>{
        try{
            console.log("clicked")
            const response=await adminInstance.put(`/doctors/${id}/${status}`)
            if(response.data.success){
                setDoctors((prevState)=>prevState?.map((doctor)=>doctor._id===id?{...doctor,isBlocked:!status}:doctor))

            }

        }
        catch(error){
            if (error instanceof AxiosError) {
              toast.error(error.response?.data?.message, {
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
            }

        }


    }
     const applyFilter = (
       doctors: any[],
       filter: "all" | "blocked" | "unblocked"
     ) => {
       if (filter === "all") {
         setFilteredDoctors(doctors);
       } else if (filter === "blocked") {
         setFilteredDoctors(doctors.filter((user) => user.isBlocked === true));
       } else {
         setFilteredDoctors(doctors.filter((user) => user.isBlocked === false));
       }
     };
     useEffect(() => {
       applyFilter(doctors as any[], filter);
     }, [filter, doctors]);
    
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
            <h1 className="text-2xl font-bold">Doctors List</h1>{" "}
          </div>

          <div className="flex justify-between mb-4">
            {/* Search bar on the left */}
            {/* Filter buttons on the right */}
            <div className="flex items-center">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 mr-2 rounded-lg transition-all ${
                  filter === "all"
                    ? "bg-[#56aac6] text-white"
                    : "bg-gray-300 text-gray-700"
                } hover:bg-[#4993ac]`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("blocked")}
                className={`px-4 py-2 mr-2 rounded-lg transition-all ${
                  filter === "blocked"
                    ? "bg-[#56aac6] text-white"
                    : "bg-gray-300 text-gray-700"
                } hover:bg-[#4993ac]`}
              >
                Blocked
              </button>
              <button
                onClick={() => setFilter("unblocked")}
                className={`px-4 py-2 mr-2 rounded-lg transition-all ${
                  filter === "unblocked"
                    ? "bg-[#56aac6] text-white"
                    : "bg-gray-300 text-gray-700"
                } hover:bg-[#4993ac]`}
              >
                Unblocked
              </button>
            </div>
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
                  Email
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDoctors &&
                filteredDoctors.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-100 transition-all"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() =>
                          handleBlockUnblock(user._id, user.isBlocked)
                        }
                        className={`mr-2 ${
                          user.isBlocked
                            ? "bg-green-500 hover:bg-green-700"
                            : "bg-red-500 hover:bg-red-700"
                        } text-white py-1 px-3 rounded-full`}
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {filteredDoctors?.length === 0 && (
            <div className=" flex  min-w-full h-10 font-bold shadow-lg text-white px-5 items-center justify-center  bg-gray-700 rounded-lg ">
              No Doctors To Show
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DoctorListing;
