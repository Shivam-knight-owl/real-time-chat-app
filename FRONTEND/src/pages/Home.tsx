import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-[#191919] text-white min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-[#814bff] to-[#5b33d1] text-white py-12 px-6 shadow-md">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Chat App</h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6">
            Experience seamless messaging like never before.
          </p>
          <Link
            to="/signup"
            className="bg-white text-[#814bff] px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-[#1a1a2e] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#24243e] p-6 rounded-lg shadow-md text-center hover:scale-105 transition-transform">
              <h3 className="text-2xl font-semibold mb-4">Real-Time Messaging</h3>
              <p className="text-gray-300">
                Send and receive messages instantly with a smooth and fast interface.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-[#24243e] p-6 rounded-lg shadow-md text-center hover:scale-105 transition-transform">
              <h3 className="text-2xl font-semibold mb-4">Add Contacts</h3>
              <p className="text-gray-300">
              Add friends and family to your contact list and keep in touch effortlessly.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-[#24243e] p-6 rounded-lg shadow-md text-center hover:scale-105 transition-transform">
              <h3 className="text-2xl font-semibold mb-4">Secure Messaging</h3>
              <p className="text-gray-300">
                Experience end-to-end encryption ensuring your messages are private and secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-[#814bff] to-[#5b33d1] py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Take the Leap Today</h2>
          <p className="text-lg text-gray-200 mb-6">
            Embrace the future of communication. Sign up now and stay connected like never before.
          </p>
          <Link
            to="/signup"
            className="bg-white text-[#814bff] px-6 m-3 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Sign Up Now
          </Link>
          <Link
            to="/signin"
            className="bg-white text-[#814bff] px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#191919] text-gray-400 text-center py-6">
        &copy; {new Date().getFullYear()} Chat App. All Rights Reserved.
      </footer>
    </div>
  );
}

export default Home;
