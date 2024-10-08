import { useEffect, useState } from "react";
import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaPlus } from "react-icons/fa";

function Appbar() {
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const decodedToken = jwtDecode(token) as { id: string };
        const userId = decodedToken.id;

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/user/userinfo`,
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
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserName("");
    navigate("/signin");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-4 shadow-lg z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <Link
          to={`/blogs`}
          className="text-2xl font-semibold text-white hover:text-blue-200 transition duration-200"
        >
          Medium | Blog App
        </Link>
        <div className="flex items-center space-x-6">
          <Link to={`/publish`}>
            <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-700 transition duration-200">
              <FaPlus className="mr-2" />
              New Blog
            </button>
          </Link>
          <div className="relative">
            <Avatar name={userName} onClick={toggleDropdown} />
            {isDropdownOpen && (
              <div
                onClick={handleLogout}
                className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg py-2 flex justify-center text-gray-800 hover:bg-gray-100 transition duration-200 cursor-pointer animate-fade-in"
              >
                Logout
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appbar;
