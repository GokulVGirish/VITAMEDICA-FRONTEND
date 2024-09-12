import logo from "@/assets/logo2.png";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../Redux/hoocks";
import { useAppSelector } from "../../Redux/hoocks";
import { verifyOtpSigup } from "../../Redux/userSlice";
import { useNavigate } from "react-router-dom";
import { clearErrorMessage } from "../../Redux/userSlice";
import Cookies from "js-cookie";
import instance from "../../Axios/userInstance";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Spinner from "../extra/Spinner";
import { SocketContext  } from "../../socketio/SocketIo";
import { useContext } from "react";
const userUrl = import.meta.env.VITE_USER_API_URL;

const Otp = () => {
  const [seconds, setSeconds] = useState(120);
  const [otp, setOtp] = useState<string>("");
  const [loadingM, setLoading] = useState<boolean>(false);
  const { message, error, loading } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const accessToken = Cookies.get("accessToken");
  const socket=useContext(SocketContext)

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axios.get(
          `${userUrl}/auth/token/verify`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 200) {
          navigate("/");
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (
            error.response?.status === 403 &&
            error.response.data.message === "not yet verified"
          ) {

          } else {
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      }
    };
    if (accessToken) {
      verify();
    } else {
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevState) => {
        if (prevState > 0) {
          return prevState - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);
  useEffect(() => {
    if (error) {

      toast.error(error, { richColors: true, duration: 1500 });
       dispatch(clearErrorMessage());
    }
    if (message) {
      toast.success(message, { richColors: true, duration: 1500 });
    }
    if (message === "signed Up Sucessfully") {
      setTimeout(() => {
        navigate("/");
        dispatch(clearErrorMessage());
      }, 2000);
    }
  }, [message, error, loading]);


  const handleResend = async () => {
    setLoading(true);

    try {
      const response = await instance.post("/auth/otp/resend");
      if (response.data.success) {
        setLoading(false)
        setSeconds(120);
        toast.success(response.data.message, {
          richColors: true,
          duration: 1500,
        });
      }
    } catch (error) {
          setLoading(false);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message, {
          richColors: true,
          duration: 1500,
        });
        if (error.response?.data.message === "retry signup") {
          Cookies.remove("accessToken");
          setTimeout(() => {
            navigate("/signup");
          }, 3000);
        }
      }
    }

  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d*$/.test(otp)) {
      return toast.error("please enter a number as otp", {
        richColors: true,
        duration: 1500,
      });
    } else if (otp.length !== 4) {
      return toast.error("Invalid otp length", {
        richColors: true,
        duration: 1500,
      });
    } else if (otp === "") {
      return toast.error("Enter an otp", {
        richColors: true,
        duration: 1500,
      });
    }
    dispatch(verifyOtpSigup({ otp ,socket}));
  };
  return (
    <div className="flex flex-1 flex-col justify-center space-y-5 max-w-md mx-auto pt-24">
      <div className="flex flex-col space-y-2 text-center">
        <img src={logo} alt="logo" className="rounded-lg shadow-xl" />
        <p className="text-md md:text-xl text-[#364f6b] font-medium">
          Enter the OTP we just sent you.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col max-w-md space-y-5">
          <div className="flex justify-center">
            <input
              type="text"
              name="otp"
              placeholder="otp"
              onChange={(e) => setOtp(e.target.value)}
              className="flex px-3 py-2 md:px-4 md:py-3 border-2 border-black rounded-l-lg font-medium placeholder:font-normal"
            />

            <button
              type="button"
              onClick={handleResend}
              disabled={seconds > 0 || loadingM}
              className={`flex items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-r-lg border-black font-medium ${
                seconds > 0 || loadingM ? "bg-slate-300" : "bg-black"
              }  text-white`}
            >
              resend
            </button>
          </div>

          <div className="flex items-center gap-4 flex-col w-full">
            <button
              type="submit"
              className="flex w-full  items-center justify-center flex-none px-3 py-2 md:px-4 md:py-3 border-2 rounded-lg font-medium border-black bg-black text-white"
            >
              Confirm
            </button>
           
            <div className="w-36 mx-1 p-2 bg-black flex flex-col items-center justify-center gap-3 h-24 text-white  rounded-lg">
              <div className="font-mono text-4xl leading-none" x-text="seconds">
                {seconds.toString().padStart(2, "0")}
              </div>
              <div className="font-mono uppercase text-lg  leading-none">
                Seconds
              </div>
              {loading||loadingM && <Spinner isUser={true}/>}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Otp;
