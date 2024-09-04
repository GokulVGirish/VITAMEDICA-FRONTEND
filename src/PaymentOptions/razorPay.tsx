import { AxiosError } from "axios";
import instance from "../Axios/userInstance";
import { toast } from "sonner";
const  razorPay=(order:any,id:string,slotDetails:any,navigate:Function):any=>{

    const amount = String(parseFloat(order.amount)/100);
    console.log("amount",amount)


var options = {
  key: "rzp_test_ju6rorodT9IZ3H", 
  amount: amount,
  currency: "INR",
  name: "VITAMEDICA",
  description: "Test Transaction",
  image: "https://example.com/your_logo",
  order_id: order.id,
  handler: async function (response: any) {
   
   
   try{
     const result = await instance.post("/appointments/order/validate", {
       razorpay_order_id: response.razorpay_order_id,
       razorpay_payment_id: response.razorpay_payment_id,
       razorpay_signature: response.razorpay_signature,
       docId: id,
       slotDetails,
       fees: amount,
     });
  
    if (result.data.success) {
      localStorage.setItem(
        "appointmentData",
        JSON.stringify({
          date: result.data.appointment.date,
          start: result.data.appointment.start,
          end: result.data.appointment.end
        })
      );
     
       
        await navigate(
          `/paymentSuccess`
        );
    
    }
    
   
       
     

   }catch(error){
    if(error instanceof AxiosError){
      toast.error(error.response?.data.message,{richColors:true,duration:1500})
    }

   }

  },
  prefill: {
    name: "Gaurav Kumar",
    email: "gaurav.kumar@example.com",
    contact: "9000090000",
  },
  notes: {
    address: "Razorpay Corporate Office",
  },
  theme: {
    color: "#3399cc",
  },
};
var rzp1 = new window.Razorpay(options);
rzp1.on("payment.failed", function (response: any) {
  // alert(response.error.code);
  // alert(response.error.description);
  // alert(response.error.source);
  // alert(response.error.step);
  // alert(response.error.reason);
  navigate("/paymentFailure",{state:{reason:response.error.reason}})
  // alert(response.error.metadata.order_id);
  // alert(response.error.metadata.payment_id);
});

rzp1.open();
}
export default razorPay
