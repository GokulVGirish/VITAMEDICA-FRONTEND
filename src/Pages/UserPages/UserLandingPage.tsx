import Navbar from "../../Components/UserComponents/Navbar"
import Banner from "../../Components/UserComponents/Banner"
import ThingsExplained from "../../Components/UserComponents/ThingsExplained"
import DoctorsScrollX from "../../Components/UserComponents/Doctors-Scroll-x"
import FeedbacksScroll from "../../Components/UserComponents/Feedbacks"
import Footer from "../../Components/UserComponents/Footer"
import Testimonial from "../../Components/UserComponents/Testimonial"
import useVerifyToken from "../../hooks and functions/verifyToken"
import { useEffect } from "react"
const UserLangingPage=()=>{
  
    
        

  
    return (
       <div>
        <Navbar/>
        <Banner/>
        <ThingsExplained/>
        <DoctorsScrollX/>
        <FeedbacksScroll/>
        <Testimonial/>
        <Footer/>
       </div>
    )
}
export default UserLangingPage