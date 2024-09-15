import { useEffect} from "react";
import UserDoctorDetail from "../../Components/UserComponents/DoctorDetail"
import Navbar from "../../Components/UserComponents/Navbar"


const UserDoctorDetailPage=()=>{
       useEffect(() => {
 
         window.scrollTo({ top: 0, behavior: "smooth" });
       }, []);


    return (
        <div>
            <Navbar/>
            <UserDoctorDetail/>
        </div>
    )
}
export default UserDoctorDetailPage