import useVerifyToken from "../../hooks and functions/verifyToken"


const DoctorDash=()=>{
    useVerifyToken("doctor")
    return (
      <h1 className="text-6xl font-bold">
        Doctor Dashboard 
      </h1>
    );
}
export default DoctorDash