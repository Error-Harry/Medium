import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useToken, useUserDetails } from "../hooks";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { UpdateUserInput } from "@error_harry/medium-validation";

function Profile() {
  const { userId } = useToken();
  const { loading, userDetails } = useUserDetails({ id: userId || "" });
  const [userUpdateData, setUserUpdateData] = useState<UpdateUserInput>({
    name: "",
    email: "",
    password: undefined,
  });
  const [allowPasswordUpdate, setAllowPasswordUpdate] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [blogCount, setBlogCount] = useState<number>(0);

  useEffect(() => {
    if (userDetails) {
      setUserUpdateData((prev) => ({
        ...prev,
        name: userDetails.name || "",
        email: userDetails.email || "",
      }));
      setBlogCount(userDetails._count.posts);
    }
  }, [userDetails]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (!userDetails) {
    return <div className="text-center text-red-500">User not found.</div>;
  }

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (allowPasswordUpdate && newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/user/auth/update`,
        {
          id: userId,
          name: userUpdateData.name,
          email: userUpdateData.email,
          ...(allowPasswordUpdate && { password: newPassword }),
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/user/auth/delete`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        data: {
          id: userId,
        },
      });
      localStorage.removeItem("token");
      setSuccessMessage("Profile deleted successfully!");
      setTimeout(() => {
        window.location.href = "/signin";
      }, 800);
      setShowConfirmDelete(false);
    } catch (error) {
      setError("Failed to delete profile. Please try again.");
      setShowConfirmDelete(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (name === "allowPasswordUpdate") {
      setAllowPasswordUpdate(checked);
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setUserUpdateData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      <div className="absolute top-20 right-20 flex items-center justify-center w-48 h-12 bg-blue-600 text-white text-xl font-bold rounded-lg">
        <div>Blog Count</div>
        <div className="flex items-center justify-center rounded-full bg-white w-10 h-10 ml-5 text-blue-600">
          {blogCount}
        </div>
      </div>
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          User Profile
        </h2>
        <form className="space-y-6" onSubmit={handleUpdateProfile}>
          <Input
            label="Name"
            name="name"
            placeholder="Enter your name"
            value={userUpdateData.name}
            onChange={handleChange}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={userUpdateData.email}
            onChange={handleChange}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              name="allowPasswordUpdate"
              checked={allowPasswordUpdate}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-gray-600 font-medium">Update Password</label>
          </div>
          {allowPasswordUpdate && (
            <div className="relative">
              <Input
                label="New Password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={handleChange}
              />
              <span
                className="absolute right-3 top-9 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          )}
          {allowPasswordUpdate && (
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={handleChange}
            />
          )}
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
          >
            Update Profile
          </button>
        </form>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="text-red-600 hover:text-red-800"
          >
            Delete Profile
          </button>
        </div>
        {showConfirmDelete && (
          <div className="mt-4 p-4 border border-gray-300 rounded-lg shadow-lg bg-white">
            <p className="text-gray-800">
              Are you sure you want to delete your profile?
            </p>
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={handleDeleteProfile}
                className="text-green-600 hover:text-green-800"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="text-red-600 hover:text-red-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {successMessage && (
          <div className="mt-4 p-2 bg-green-100 text-green-800 rounded-lg shadow-md">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}

interface InputType {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  value: string | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

function Input({
  label,
  type = "text",
  name,
  placeholder,
  value,
  onChange,
}: InputType) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300 transition duration-200"
      />
    </div>
  );
}

export default Profile;
