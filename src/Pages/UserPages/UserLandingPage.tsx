import Navbar from "../../Components/UserComponents/Navbar"
import Banner from "../../Components/UserComponents/Banner"
import ThingsExplained from "../../Components/UserComponents/VitamedicaFeatures"
import DoctorsScrollX from "../../Components/UserComponents/Doctors-Scroll-x"
import FeedbacksScroll from "../../Components/UserComponents/Feedbacks"
import Footer from "../../Components/UserComponents/Footer"
import Testimonial from "../../Components/UserComponents/Testimonial"
import NewsSection from "../../Components/UserComponents/NewsSection"
import CopartnersSliding from "../../Components/UserComponents/CopartnersSliding"
const UserLangingPage=()=>{
  
    
        

  
    return (
      <div>
        <Navbar />
        <Banner />
        <ThingsExplained />
        <DoctorsScrollX />
        <NewsSection />
        <FeedbacksScroll />
        <Testimonial />
        <CopartnersSliding/>
        <Footer />
      </div>
    );
}
export default UserLangingPage