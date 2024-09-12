import { useState,useEffect } from "react";
import adminInstance from "../../Axios/adminInstance";
import {  AxiosError } from "axios";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DepartmentsListing=()=>{
     const [departments, setDepartments] = useState<any[]>([]);
     const [department,setDepartment]=useState<string>("")
     useEffect(()=>{
        const getDepartments=async()=>{
            try{
                const response=await adminInstance.get("/departments")
                if(response.data.success){
                    setDepartments(response.data.departments)
                }

            }
            catch(error){
              if(error instanceof AxiosError){
                console.log(error.response?.data.message)
              }

            }

        }
        getDepartments()

     },[])
     const addDepartment=async()=>{
    
        if(!department.trim()){
       
              toast.error("Enter a department", {
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
            return
        }
        try{
            const response = await adminInstance.post(
              "/departments",
              {department}
            );
            if(response.data.success){
                  toast.success(response.data.message, {
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
                  setDepartment("")
                  setDepartments([...departments,response.data.department])

            }

        }
        catch(error){
            setDepartment("")
            if(error instanceof AxiosError){
                console.log(error)
                console.log(error.response?.data?.message);
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
     const handleDelete=async(id:string)=>{
        try{
             const response=await adminInstance.delete(`/departments/${id}`)
            
             if(response.data.success){
                
                 toast.success(response.data.message, {
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
               const newDepartmentList = departments.filter(
                 (department) => department._id !== id
               );
               setDepartments(newDepartmentList);


             }

        }
        catch(error){
             if(error instanceof AxiosError){
                console.log(error)
                console.log(error.response?.data?.message);
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
              <h1 className="text-2xl font-bold">Departments</h1>{" "}
            </div>

            <div className="flex justify-between mb-4">
              {/* Search bar on the left */}
              {/* Filter buttons on the right */}
              <div className="mt-6 flex gap-0">
                <input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  type="text"
                  placeholder="Add Departments..."
                  className="w-2/3 sm:w-1/2 bg-white px-4 py-2 text-sm text-black rounded-l-xl"
                />
                <button
                  onClick={addDepartment}
                  className="bg-[#56aac6] px-4 py-2 rounded-r-xl text-white font-medium"
                >
                  Add
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
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departments &&
                  departments.map((department) => (
                    <tr
                      key={department._id}
                      className="hover:bg-gray-100 transition-all"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {department.name}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(department._id)}
                          className={`mr-2 bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded-full`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

}
export default DepartmentsListing