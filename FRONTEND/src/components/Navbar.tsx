import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {FaTelegramPlane} from 'react-icons/fa';
import { toast } from 'react-toastify';

interface NavbarProps {
  setUser: (user: any) => void;
}

function Navbar({ setUser }: NavbarProps) {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      try {
        fetch(import.meta.env.VITE_BACKEND_URL+"/logout", {
          method: "POST",
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            // alert(data.message);//better will be to use a toast library as alert is blocking.
            if(data[1].alreadyLoggedOut){
              toast.info(data[0].message,{position: "top-center",autoClose: 3000});
            }
            else{
              toast.success(data[0].message,{position: "top-center",autoClose: 3000});
              //but before redirecting back to /signin we need to remove the user from the app component
              setUser(null);//setting the user in the app component to null
              //redirect to the signin page
              navigate("/signin");
            }
          });
      } catch (err) {
        console.error("Error logging out:", err);
      }
    };  

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  // Close the dropdown when the screen size increases
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav
      className="bg-gradient-to-r from-[#814bff] to-[#5b33d1] text-white px-6 py-4 shadow-md  sticky top-0 z-50"
    >
      <div className="flex justify-between items-center ">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <FaTelegramPlane size={24} className="text-white" />
          <Link to={"/"} className="text-2xl font-bold text-white">BlinkChat</Link>
        </div>

        {/* Desktop Menu (visible on `md` and larger) */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/"
            className="hover:text-[#191919] transition-colors"
          >
            Home
          </Link>
          <Link
            to="/signup"
            className="hover:text-[#191919]  transition-colors"
          >
            Signup
          </Link>
          <Link
            to="/signin"
            className="hover:text-[#191919]  transition-colors"
          >
            Signin
          </Link>
          <Link
            to="/chat"
            className="hover:text-[#191919] transition-colors"
          >
            Chat
          </Link>
          <button
            onClick={handleLogout}
            className="bg-[#ffffff] text-[#814bff] hover:bg-[#191919] hover:text-[#ffffff] px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button (visible below `md`) */}
        <div className="md:hidden">
          <button className="focus:outline-none text-white cursor-pointer" onClick={toggleMenu} >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu (visible when `isOpen` is true and screen is smaller than `md`) */}
      {isOpen && (
        <div className="mt-4 space-y-2 md:hidden cursor-pointer">
          <Link
            to="/"
            className="block hover:text-[#191919] transition-colors"
          >
            Home
          </Link>
          <Link
            to="/signup"
            className="block hover:text-[#191919] transition-colors"
          >
            Signup
          </Link>
          <Link
            to="/signin"
            className="block hover:text-[#191919] transition-colors"
          >
            Signin
          </Link>
          <Link
            to="/chat"
            className="block hover:text-[#191919] transition-colors"
          >
            Chat
          </Link>
          <button
            onClick={handleLogout}
            className="bg-[#ffffff] text-[#814bff] hover:bg-[#191919] hover:text-[#ffffff] px-2 py-1 rounded-md text-xs font-medium transition-colors w-full cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
