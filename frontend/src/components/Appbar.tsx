import { useEffect, useRef, useState } from "react";
import { Avatar } from "./BlogCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import { BACKEND_URL } from "../../config";
import { useToken } from "../hooks";

function Appbar() {
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { userId } = useToken();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/api/v1/user/userinfo`,
          { id: userId }
        );

        if (response.data.user) {
          setUserName(response.data.user.name);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserName("");
    navigate("/signin");
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-4 shadow-lg z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <div
          onClick={() => navigate("/blogs")}
          className="cursor-pointer text-2xl font-semibold text-white hover:text-blue-200 transition duration-200"
        >
          Medium | Blog App
        </div>
        <div className="flex items-center space-x-6">
          <button
            onClick={() => handleNavigation("/publish")}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition duration-200"
          >
            <FaPlus className="mr-2" />
            New Blog
          </button>
          <div className="relative" ref={dropdownRef}>
            <Avatar name={userName} onClick={toggleDropdown} />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg py-2 text-gray-800">
                <div
                  onClick={() => handleNavigation("/profile")}
                  className="text-center block px-4 py-2 hover:bg-gray-100 transition cursor-pointer"
                >
                  Profile
                </div>
                <div
                  onClick={() => handleNavigation("/my-blogs")}
                  className="text-center block px-4 py-2 hover:bg-gray-100 transition cursor-pointer"
                >
                  My Blogs
                </div>
                <div
                  onClick={handleLogout}
                  className="px-4 py-2 text-center text-red-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appbar;
