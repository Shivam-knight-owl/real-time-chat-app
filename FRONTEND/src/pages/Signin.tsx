import { useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaComment, FaRegCommentDots, FaTelegramPlane, FaSmile, FaCommentAlt, FaCommentDollar, FaCommentDots, FaCommentMedical, FaCommentSlash, FaComments, FaAddressBook, FaAndroid, FaAddressCard, FaApple, FaBasketballBall, FaCoffee, FaFootballBall } from "react-icons/fa"; // Import chat-related icons
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface SigninProps {
  setUser: (user: string) => void;
}

function Signin({ setUser }: SigninProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

  const navigate=useNavigate();

  // Chat icons for background (repeated in a 2D matrix)
  const chatIcons = [
    FaComment,
    FaRegCommentDots,
    FaTelegramPlane,
    FaSmile,
    FaComment,
    FaComments,
    FaCommentAlt,
    FaCommentDots,
    FaCommentMedical,
    FaCommentSlash,
    FaCommentDollar,
    FaAddressBook,
    FaAndroid,
    FaAddressCard,
    FaApple,
    FaBasketballBall,
    FaCoffee,
    FaFootballBall,
    
  ];

  // Floating animation for each icon (stays in position but floats)
  const floatingAnimation = {
    y: [-10, 10, -10], // Move up and down smoothly
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const handleSignin=()=>{
    fetch(import.meta.env.VITE_BACKEND_URL+"/signin",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      credentials:"include",
      body:JSON.stringify({username,password}),
    })
    .then((res)=>res.json())
    .then((data)=>{
      if(data.invalidCredentials){
        toast.error("Invalid Credentials", { position: "top-center" });
      }else{
        toast.success("Signin successful", { position: "top-center" });
        //after successfull signin redirect to chat page but it is protected so we need to set the user in the app component to make it accessible to the chat component and then redirect to chat page
        setUser(data.user.username);//setting the user in the app component
        navigate("/chat");
      }
    })
    .catch((err)=>console.error("Signin failed",err));
  }

  return (
    <div className="bg-[#191919] min-h-screen flex items-center justify-center p-4 relative">
      {/* Chat Icons Section: Repeated in a 2D grid */}
      <div className="absolute top-0 left-0 w-full h-full z-0 grid grid-cols-6 grid-rows-6 gap-4 opacity-80">
        {/* Mapping the icons repeatedly to cover the background */}
        {Array.from({ length: 36 }).map((_, index) => {// 6x6 grid
          const Icon = chatIcons[index % chatIcons.length]; // Cycle through the icons
          return (
            <motion.div
              key={index}
              className="flex justify-center items-center"
              animate={floatingAnimation} // Apply floating effect
            >
              <Icon size={28} className="text-[#814bff] opacity-50" />
            </motion.div>
          );
        })}
      </div>

      <div className="bg-[#24243e] p-8 rounded-lg shadow-lg w-full max-w-md relative z-10">
        {/* Left Side: Signup Form */}
        <div className="space-y-4 relative">
          <h2 className="text-4xl font-bold text-center text-white mb-6">Signin</h2>
          
          <div className="space-y-4">
            {/* Username Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 bg-[#1a1a2e] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#814bff] transition-all"
              />
            </div>

            {/* Password Input with Eye Icon */}
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-[#1a1a2e] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#814bff] transition-all"
              />
              <div
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#814bff]"
              >
                {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </div>
            </div>

            {/* Signin Button */}
            <button
              onClick={handleSignin}
              className="w-full py-3 bg-[#814bff] text-white font-semibold rounded-lg hover:bg-[#5b33d1] transition-colors cursor-pointer"
            >
              Signin
            </button>

            {/* Not a member? */}
            <div className="text-center text-gray-300">
              Not a member?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-[#814bff] cursor-pointer"
              >
                Signup
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;
