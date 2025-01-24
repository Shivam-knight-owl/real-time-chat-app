import { Link } from "react-router-dom";

function Navbar({ handleLogout }: { handleLogout: () => void }) {
  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white px-6 py-4 shadow-md">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-blue-500">Chat App</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/" className="hover:text-blue-800 transition-colors">Home</Link>
        <Link to="/signup" className="hover:text-blue-300 transition-colors">Signup</Link>
        <Link to="/signin" className="hover:text-blue-300 transition-colors">Signin</Link>
        <Link to="/chat" className="hover:text-blue-300 transition-colors">Chat</Link>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;