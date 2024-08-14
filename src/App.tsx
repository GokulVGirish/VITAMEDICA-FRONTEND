import { BrowserRouter,Routes,Route } from "react-router-dom"
import UserRoute from "./Routes/UserRoutes"
import DoctorRoute from "./Routes/DoctorRoutes"
import AdminRoute from "./Routes/AdminRoutes"
import ErrorPage from "./Components/extra/ErrorPage"
import { Toaster } from "sonner"
import SocketProvider from "./socketio/SocketIo"

import { useEffect } from "react"
function App() {


  return (
    <>
      <BrowserRouter>
        <Toaster richColors />
        <SocketProvider>
          <Routes>
            <Route path="/*" element={<UserRoute />} />
            <Route path="/doctor/*" element={<DoctorRoute />} />
            <Route path="/admin/*" element={<AdminRoute />} />
          </Routes>
        </SocketProvider>
      </BrowserRouter>
    </>
  );
}

export default App
