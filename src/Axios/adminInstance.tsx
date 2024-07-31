import axios from "axios"
import Cookies from "js-cookie"

const adminInstance=axios.create({
    baseURL:"http://localhost:4000/admin",
    headers:{
        "Content-Type":"application/json"
    }
    
})
adminInstance.interceptors.request.use(
    (request)=>{
          const accessToken=Cookies.get("adminAccessToken")
          if(accessToken){
            request.headers.Authorization=`Bearer ${accessToken}`
          }
          return request

    },
    (error)=>Promise.reject(error)
)
adminInstance.interceptors.response.use(
    (response)=>response,
    (error)=>{
          if(error.response && error.response.status===401){
            window.location.href="/admin/login"
        }
        return Promise.reject(error)
    }
)






export default adminInstance