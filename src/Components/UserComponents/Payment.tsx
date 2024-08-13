import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import instance from "../../Axios/axios";
import { AxiosError } from "axios";
import logo from "@/assets/logo1.png";
import moment from "moment";
import razorPay from "../../PaymentOptions/razorPay";
import { useNavigate } from "react-router-dom";


const PaymentComponent = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<{_id: string;name: string;fees: string;image: string;department: {name:string };
  } | null>(null);
  console.log("doctor", doctor);
  const [paymentMethod, setPaymentMethod] = useState<string|null>(null);
  const slotDetailUnparsed=localStorage.getItem("bookingDetails")
  const slotDetails=JSON.parse(slotDetailUnparsed as string)
  const navigate=useNavigate()
  console.log('slotDetails',slotDetails)



  useEffect(() => {
    const getDoctorDetail = async () => {
      try {
        const response = await instance.get(`/doctors/${id}/profile`);

        if (response.data.success) {
          setDoctor(response.data.doctor);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          return toast.error(error.response?.data.message, {
            richColors: true,
            duration: 1500,
          });
        } else {
          return toast.error("unknown error", {
            richColors: true,
            duration: 1500,
          });
        }
      }
    };
    getDoctorDetail();
  }, []);
  const handlePayment=async()=>{
   
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    
    const slotStart = new Date(slotDetails.slotTime.start);
    const slotStartHours = slotStart.getHours();
    const slotStartMinutes = slotStart.getMinutes();

   
    if (slotDetails.date && moment(slotDetails.date).isSame(now, "day")) {
     
      if (
        slotStartHours < currentHours ||
        (slotStartHours === currentHours && slotStartMinutes <= currentMinutes)
      ) {
        return toast.error(" Cant Book slot.This slot's time has already passed.", {
          richColors: true,
          duration: 1500,
        });
      }
    }
     if (!paymentMethod) {
       return toast.error("Select A Payment Method");
     }

  try{
     const lockResponse = await instance.post("/appointments/lock-slot", {
       doctorId: doctor?._id,
       date: slotDetails?.date,
       slotId: slotDetails?.slotTime?._id,
     });
        console.log("lock response", lockResponse.data);

     if (!lockResponse.data.success) {
   
       return toast.error(lockResponse.data.message,{richColors:true,duration:1500});
     }
      const response = await instance.post("/appointments/order", {
        amount: doctor?.fees,
        currency: "INR",
        receipt: doctor?._id,
      });
    
      if (response.data.success) {
        console.log("order",response.data.order);
        razorPay(response.data.order,id as string,slotDetails,navigate);
      }

  }
  catch(error){
    if(error instanceof AxiosError){
      toast.error(error.response?.data.message, {
        richColors: true,
        duration: 1500,
      });
    }
    console.log(error)

  }

  }

  return (
    <div className="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900">
      <div className="rounded-t-lg h-32 overflow-hidden">
        <img
          className="object-cover object-top w-full"
          src={logo}
          alt="Mountain"
        />
      </div>
      <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
        <img
          className="object-cover object-center h-32"
          src={
            doctor?.image ||
            "https://photosbull.com/wp-content/uploads/2024/05/no-dp_16.webp"
          }
          alt="Woman looking front"
        />
      </div>
      <div className="text-center mt-2">
        <h2 className="font-semibold text-2xl">Dr {doctor?.name}</h2>
        <p className="text-gray-500">{doctor?.department?.name}</p>
      </div>
      <div className="text-center text-3xl font-bold">₹{doctor?.fees}</div>
      <div className="text-center text-lg font-bold">
        {moment(slotDetails?.date).format("MMMM D, YYYY")}
      </div>

      <div className="text-center text-lg font-bold">
        {moment(slotDetails?.slotTime?.start).format("h:mm A")}-{" "}
        {moment(slotDetails?.slotTime).format("h:mm A")}
      </div>
      <div className="p-4 border-t mx-8 mt-2">
        <div>
          <label className="flex bg-gray-100 text-gray-700 rounded-md px-3 py-2 my-3  hover:bg-indigo-30 cursor-pointer">
            <input
              type="radio"
              onChange={(e) => setPaymentMethod(e.target.value)}
              value={"razorpay"}
            />
            <i className="pl-2">Razorpay</i>
          </label>
        </div>
        <button
          onClick={handlePayment}
          className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2"
        >
          Pay
        </button>
      </div>
    </div>
  );
};
export default PaymentComponent;
