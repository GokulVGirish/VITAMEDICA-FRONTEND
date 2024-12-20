import { SocketContext } from "../socketio/SocketIo";
import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useRef } from "react";
import Swal from "sweetalert2";
import StarRating from "../Components/extra/RatingStar";
import PrescriptionModal from "../Components/extra/PrescriptionModal";
import { useNavigate } from "react-router-dom";
import { FiVideo, FiVideoOff, FiMic, FiMicOff } from "react-icons/fi";
import { FaPhone, FaTimes } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import InstructionModal from "../Components/extra/CuteGirlInstruction";
import IsCallingModal from "../Components/extra/IsCallingModal";

// const configuration = {
//   iceServers: [
//     {
//       urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
//     },
//   ],
//   iceCandidatePoolSize: 10,
// };
const configuration = {
  iceServers: [
    {
      urls: "turn:turn.anonymous10.cloud:3478",
      username: "user",
      credential: "pass",
    },
  ],
};

const VideoCall = () => {
  const { appointment, callerId, toPersonId, role } = useParams<{
    appointment: string;
    callerId: string;
    toPersonId: string;
    role: string;
    img: string;
  }>();

  
  const state = useLocation().state;
  const img = state.img;

  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [newMessage, setNewMessages] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showPrescription, setShowPrescription] = useState(false);
  console.log(
    "appointment",
    appointment,
    "callerId",
    callerId,
    "userId",
    toPersonId
  );
  const socket = useContext(SocketContext);
  const [showInstructionModal, setInstructionModal] = useState(false);
  const [showIsCalling, setShowIsCalling] = useState(false);
  const room = appointment;
  const navigate = useNavigate();

  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const startButton = useRef<HTMLButtonElement | null>(null);
  const hangupButton = useRef<HTMLButtonElement | null>(null);
  const muteAudButton = useRef<HTMLButtonElement | null>(null);
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  const muteVideoButton = useRef<HTMLButtonElement | null>(null);

  const [audioState, setAudio] = useState(true);
  const [videoState, setVideoState] = useState(true);

  useEffect(() => {
    if (socket && room) {
      socket?.emit("join", room);
    }

    socket?.on("calling", (data: any) => {
      if (!localStream.current) {
        console.log("not ready yet");
        return;
      }
      switch (data.type) {
        case "offer":
          handleOffer(data);
          break;
        case "answer":
          handleAnswer(data);
          break;
        case "candidate":
          handleCandidate(data);
          break;
        case "ready":
          if (pc.current) {
            alert("already in call ignoring");
            return;
          }
          makeCall();
          break;
        case "bye":
          if (pc.current) {
            hangup();
          }
          break;
        default:
          console.log("unhandled", data);
          break;
      }
    });

    socket?.on("ignoredStatus", () => {
      alert("a");
      hangup();
      Swal.fire({
        title: "Call ended",
      });
    });

    socket?.on("chat-message", (data) => {
      const { message, from } = data;
      setMessages((prevState) => [...prevState, { sender: from, message }]);
    });
    setInstructionModal(true);

    return () => {
      socket?.off("calling");
      socket?.off("ignoredStatus");
    };
  }, [room, socket]);
  socket?.on("cut-call", () => {
    setShowIsCalling(false);
    Swal.fire({
      title: "User rejected the call",
      confirmButtonText: "Ok",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("User acknowledged the call was cut");
        hangup();
      }
    });
  });
  socket?.on("review", () => {
    Swal.fire({
      title: "Do you finish the call?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Reconnect",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Call finished.");
        setShowRatingModal(true);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("Reconnecting to the call...");
        startB();
      }
    });
  });
  socket?.on("prescription", () => {
    Swal.fire({
      title: "Do you finish the appointment?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Reconnect",
    }).then((result) => {
      if (result.isConfirmed) {
        setShowPrescription(true);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("Reconnecting to the call...");
        startB();
      }
    });
  });

  async function makeCall() {
    try {
      pc.current = new RTCPeerConnection(configuration);
      pc.current.onicecandidate = (e) => {
        if (e.candidate) {
          const message = {
            type: "candidate",
            candidate: e.candidate.candidate,
            sdpMid: e.candidate.sdpMid,
            sdpMLineIndex: e.candidate.sdpMLineIndex,
          };
          socket?.emit("calling", { room, data: message });
        }
      };
      pc.current.ontrack = (e) => {
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = e.streams[0];
        }
      };
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => {
          pc.current?.addTrack(track, localStream.current as MediaStream);
        });
      }
      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);
      socket?.emit("calling", {
        room,
        data: { type: "offer", sdp: offer.sdp },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function handleOffer(offer: RTCSessionDescriptionInit) {
    if (pc.current) {
      console.error("existing peerconnection");
      return;
    }
    try {
      pc.current = new RTCPeerConnection(configuration);
      pc.current.onicecandidate = (e) => {
        if (e.candidate) {
          const message = {
            type: "candidate",
            candidate: e.candidate.candidate,
            sdpMid: e.candidate.sdpMid,
            sdpMLineIndex: e.candidate.sdpMLineIndex,
          };
          socket?.emit("calling", { room, data: message });
        }
      };

      pc.current.ontrack = (e) => {
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = e.streams[0];
        }
      };
      if (localStream.current) {
        localStream.current
          .getTracks()
          .forEach((track) =>
            pc.current?.addTrack(track, localStream.current as MediaStream)
          );
      }
      await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);
      socket?.emit("calling", {
        room,
        data: { type: "answer", sdp: answer.sdp },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function handleAnswer(answer: RTCSessionDescriptionInit) {
    setShowIsCalling(false);
    if (!pc.current) {
      console.error("no peerconnection");
      return;
    }
    try {
      await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (e) {
      console.log(e);
    }
  }

  async function handleCandidate(candidate: RTCIceCandidateInit) {
    try {
      if (!pc.current) {
        console.error("No peer connection");
        return;
      }

      if (candidate.candidate) {
        await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        console.error("Incomplete ICE candidate received", candidate);
      }
    } catch (e) {
      console.log("Error handling ICE candidate:", e);
    }
  }

  async function hangup(callend?: { callend: boolean }) {
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }
    if (startButton.current) startButton.current.disabled = false;
    if (hangupButton.current) hangupButton.current.disabled = true;
    if (muteAudButton.current) muteAudButton.current.disabled = true;
    if (muteVideoButton.current) muteVideoButton.current.disabled = true;
    console.log("role is ", role, "callend", callend);
    if (role === "doctor") {
      socket?.emit("review", { to: toPersonId });
    } else if (role === "user") {
      socket?.emit("prescription", { to: toPersonId });
    }
  }

  useEffect(() => {
    if (hangupButton.current) hangupButton.current.disabled = true;
    if (muteAudButton.current) muteAudButton.current.disabled = true;
    if (muteVideoButton.current) muteVideoButton.current.disabled = true;
  }, []);

  async function startB() {
    setShowIsCalling(true);
    setInstructionModal(false);

    localStream.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: { echoCancellation: true },
    });
    if (localVideo.current) {
      localVideo.current.srcObject = localStream.current;
    }

    socket?.emit("call-request", {
      room,
      from: callerId,
      to: toPersonId,
    });

    if (startButton.current) startButton.current.disabled = true;
    if (hangupButton.current) hangupButton.current.disabled = false;
    if (muteAudButton.current) muteAudButton.current.disabled = false;
    if (muteVideoButton.current) muteVideoButton.current.disabled = false;

    socket?.emit("calling", { room, data: { type: "ready" } });
  }

  const hangB = async () => {
    setShowIsCalling(false);
    Swal.fire({
      title: "Are you sure you want to end the call?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((res) => {
      if (res.isConfirmed) {
        hangup({ callend: true });
        socket?.emit("calling", { room, data: { type: "bye" } });
      }
    });
  };

  function muteAudio() {
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setAudio(!audioState);
    }
  }

  function pauseVideo() {
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setVideoState(!videoState);
    }
  }
  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket?.emit("chat-message", {
        message: newMessage,
        from: callerId,
        to: toPersonId,
      });
      setMessages((prevState) => [
        ...prevState,
        { sender: callerId as string, message: newMessage },
      ]);
      setNewMessages("");
    }
  };

  const handleCloseRating = async () => {
    setShowRatingModal(false);
    navigate(`/profile/appointmentDetail/${room}`);
  };

  return (
    <div className="md:h-[100vh]  h-[100vh] bg-[#110620] w-full md:w-full justify-center flex-col md:flex-row  flex items-center md:justify-around">
      {showIsCalling && role === "doctor" && <IsCallingModal />}
      <div className="flex flex-col lg:flex-row items-center justify-center">
        {/* Local video container */}
        <div className="order-2 mt-5 lg:mt-0 lg:absolute bottom-5 lg:bottom-10 left-14  flex flex-col items-center lg:space-y-8">
          <div className="bg-gray-500 w-[300px] h-[280px] lg:h-32 lg:w-44 border border-black rounded-lg shadow-md">
            <video
              ref={localVideo}
              className="w-full h-full rounded-lg object-cover"
              autoPlay
              playsInline
              muted
            ></video>
          </div>
        </div>

        {/* Remote video container */}
        <div className="flex flex-col items-center mt-5 lg:mt-0 lg:space-y-8 lg:ml-8">
          <div className="bg-[#081f36] w-[300px] h-[280px] sm:w-[500px] sm:h-[350px] lg:w-[900px] lg:h-[700px] rounded-lg shadow-md">
            <video
              ref={remoteVideo}
              className="w-full h-full rounded-lg object-cover"
              autoPlay
              playsInline
            ></video>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 absolute bottom-[340px] sm:bottom-[400px] lg:bottom-10 lg:relative lg:mt-5">
            <button
              onClick={startB}
              ref={startButton}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              <FaPhone className="h-5 w-5" />
            </button>
            <button
              onClick={hangB}
              ref={hangupButton}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              <FaTimes className="h-5 w-5" />
            </button>
            <button
              onClick={muteAudio}
              ref={muteAudButton}
              className={`px-4 py-2 rounded-lg text-white hover:bg-gray-600 ${
                !audioState ? "bg-red-500 hover:bg-red-600" : "bg-gray-500"
              }`}
            >
              {audioState ? (
                <FiMic className="h-5 w-5" />
              ) : (
                <FiMicOff className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={pauseVideo}
              ref={muteVideoButton}
              className={`px-4 py-2 rounded-lg text-white hover:bg-gray-600 ${
                !videoState ? "bg-red-500 hover:bg-red-600" : "bg-gray-500"
              }`}
            >
              {videoState ? (
                <FiVideo className="h-5 w-5" />
              ) : (
                <FiVideoOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col mt-5 md:mt-0  flex-shrink-0 rounded-2xl bg-[#081f36] h-[280px] md:h-[500px] w-[300px] md:w-[400px] p-4">
        <div className="flex flex-col h-full overflow-x-auto mb-4">
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-12 gap-y-2">
              {messages.map((msg, index) => {
                return msg.sender !== callerId ? (
                  <div
                    key={index}
                    className="col-start-1 col-end-8 p-3 rounded-lg"
                  >
                    <div className="flex flex-row items-center">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                        <img
                          className="rounded-full"
                          src={
                            img ||
                            "https://photosbull.com/wp-content/uploads/2024/05/no-dp_16.webp"
                          }
                          alt="noimg"
                        />
                      </div>
                      <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                        <div>{msg.message}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="col-start-6 col-end-13 p-3 rounded-lg"
                  >
                    <div className="flex items-center justify-start flex-row-reverse">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                        Me
                      </div>
                      <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                        <div>{msg.message}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center h-16 rounded-xl bg-[#3a5e81] w-full px-4">
          <div></div>
          <div className="flex-grow ml-4">
            <div className="relative w-full">
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                onChange={(e) => setNewMessages(e.target.value)}
                value={newMessage}
                placeholder="Type a message..."
                className="flex w-full border rounded-xl  focus:outline-none focus:border-indigo-300 pl-4 h-10"
              />
              <button
                onClick={sendMessage}
                className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
              {showRatingModal && (
                <StarRating
                  appointmentId={appointment as string}
                  docId={toPersonId as string}
                  closeRating={handleCloseRating}
                />
              )}
              {showPrescription && (
                <PrescriptionModal
                  appointmentId={appointment as string}
                  closeModal={() => setShowPrescription(false)}
                />
              )}
            </div>
            {showInstructionModal && <InstructionModal role={role as string} />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default VideoCall;
