import { BrowserRouter,Routes,Route } from "react-router-dom"
import UserRoute from "./Routes/UserRoutes"
import DoctorRoute from "./Routes/DoctorRoutes"
import AdminRoute from "./Routes/AdminRoutes"
import ErrorPage from "./Components/extra/ErrorPage"
import { Toaster } from "sonner"
function App() {


  return (
    <>
  <BrowserRouter>
  <Toaster richColors />
  <Routes>
    <Route path="/*" element={<UserRoute/>} />
    <Route path="/doctor/*" element={<DoctorRoute/>}/>
    <Route path="/admin/*" element={<AdminRoute/>}/>
 
  </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
