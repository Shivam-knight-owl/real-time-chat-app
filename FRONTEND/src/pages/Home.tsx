import { Link } from "react-router-dom";
import { FaClock, FaUserPlus, FaTrashAlt, FaSmile } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function Home() {
  const ctaRef = useRef(null);
  const footerRef = useRef(null);
  const isCtaInView = useInView(ctaRef, { amount: 0.2 });
  const isFooterInView = useInView(footerRef, { amount: 0.2 });

  return (
    <div className="bg-[#191919] text-white min-h-screen">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-[#814bff] to-[#5b33d1] text-white py-16 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="text-4xl md:text-6xl font-extrabold tracking-wide mb-4"
          >
            Welcome to <span className="text-[#292929]">BlinkChat</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }} 
            className="text-lg md:text-xl text-gray-200 mb-6"
          >
            Experience <span className="font-semibold text-white">seamless real-time messaging</span> like never before.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Link
              to="/signup"
              className="inline-block bg-white text-[#814bff] px-4 py-2 rounded-lg font-semibold text-lg shadow-md hover:bg-[#191919] hover:text-white transition-all transform hover:scale-105"
            >
              Get Started 🚀
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-[#1a1a2e] py-14 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
            Why <span className="text-[#814bff]">BlinkChat</span> Stands Out?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature Cards */}
            {[{
              icon: <FaClock className="text-4xl text-[#814bff] mx-auto mb-4" />,
              title: "Real-Time Chat",
              text: "Send and receive messages instantly without delays, keeping your conversations fluid and engaging."
            }, {
              icon: <FaUserPlus className="text-4xl text-[#814bff] mx-auto mb-4" />,
              title: "Instant Contact Addition",
              text: "Add friends in real time and start chatting instantly without waiting for approvals."
            }, {
              icon: <FaTrashAlt className="text-4xl text-[#814bff] mx-auto mb-4" />,
              title: "Real-Time Message Deletion",
              text: "Instantly remove messages from both ends, ensuring better control over your conversations."
            }, {
              icon: <FaSmile className="text-4xl text-[#814bff] mx-auto mb-4" />,
              title: "Emotions with Emojis",
              text: "Make your chats lively by sending emojis and reactions in real time to share your emotions instantly."
            }].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-[#24243e] p-6 rounded-lg shadow-lg text-center hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                {feature.icon}
                <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action (Take the Leap Today) */}
      <motion.section
        ref={ctaRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-gradient-to-r from-[#814bff] to-[#5b33d1] py-12 px-6"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Take the Leap Today</h2>
          <p className="text-lg text-gray-200 mb-6">
            Embrace the future of communication. Sign up now and stay connected like never before.
          </p>
          <Link to="/signup" className="bg-white text-[#814bff] px-6 m-3 py-3 rounded-lg font-semibold hover:bg-[#191919] hover:text-white transition-colors">
            Sign Up Now
          </Link>
          <Link to="/signin" className="bg-white text-[#814bff] px-6 py-3 rounded-lg font-semibold hover:bg-[#191919] hover:text-white transition-colors">
            Sign In
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        ref={footerRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isFooterInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-[#191919] text-gray-400 text-center py-6"
      >
        &copy; {new Date().getFullYear()} BlinkChat. All Rights Reserved.
      </motion.footer>
    </div>
  );
}

export default Home;
