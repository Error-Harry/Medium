import { ChangeEventHandler, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput, SigninInput } from "@error_harry/medium-validation";
import axios from "axios";

function Auth({ type }: { type: "signup" | "signin" }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [signupData, setSignupData] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });

  const [signinData, setSigninData] = useState<SigninInput>({
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setError(null);
    const { value, name } = e.target;
    if (type === "signup") {
      setSignupData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setSigninData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleConfirmPasswordChange: ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setConfirmPassword(e.target.value);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (type === "signup") {
      if (signupData.password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/user/signup`,
          signupData
        );
        const jwt = response.data.jwt;
        localStorage.setItem("token", jwt);
        navigate("/blogs");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 409) {
            setError("User already exists");
          } else if (error.response.status === 411) {
            setError("Invalid inputs");
          } else {
            setError(
              error.response.data.error || "Signup failed. Please try again."
            );
          }
        } else {
          setError("Signup failed. Please try again.");
        }
        console.error(error);
      }
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/user/signin`,
          signinData
        );
        const jwt = response.data.jwt;
        localStorage.setItem("token", jwt);
        navigate("/blogs");
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setError(
            error.response.data.error || "Signin failed. Please try again."
          );
        } else {
          setError("Signin failed. Please try again.");
        }
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-md w-full space-y-6 p-8 bg-white shadow-xl rounded-3xl border border-gray-200">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">
        {type === "signup" ? "Create an account" : "Welcome Back"}
      </h1>
      <div className="text-center text-gray-600">
        {type === "signup" ? (
          <>
            Already have an account?{" "}
            <Link to={"/signin"} className="text-blue-500 hover:underline">
              Login
            </Link>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <Link to={"/signup"} className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </>
        )}
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {type === "signup" && (
          <Input
            label="Name"
            name="name"
            placeholder="Enter your name"
            value={signupData.name || ""}
            onChange={handleChange}
          />
        )}
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={type === "signup" ? signupData.email : signinData.email}
          onChange={handleChange}
        />
        <div className="relative">
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={
              type === "signup" ? signupData.password : signinData.password
            }
            onChange={handleChange}
          />
          <span
            className="absolute right-3 top-9 cursor-pointer text-gray-400"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {type === "signup" && (
          <div className="relative">
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <span
              className="absolute right-3 top-9 cursor-pointer text-gray-400"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        )}
        {error && <div className="text-red-500 text-center text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-400 transition duration-200"
        >
          {type === "signup" ? "Sign Up" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

interface InputType {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
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
        className="mt-1 block w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}

export default Auth;
