import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (!name) return alert("Please enter name");
    if (password.length < 8) return alert("Password must be at least 8 characters long!");
    if (password !== confirmPassword) return alert("Passwords do not match");

    try {
      const response = await axios.post("http://localhost:3000/api/users/register", {
        name,
        email,
        password,
      });      

      console.log("User created:", response.data);
 
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      const message = error.response?.data?.message || "Registration failed";
      setAuthError(message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/todolist");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col gap-5 rounded-lg bg-white shadow-md w-full max-w-sm p-5 sm:p-7 md:w-[400px]">
      <h1 className="text-2xl font-semibold text-gray-700 text-center">Create an account</h1>
      <form className="flex flex-col gap-4" onSubmit={register}>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-start">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-start">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-start">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-start">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {authError && <p className="text-red-500 text-sm">{authError}</p>}

        <button
          type="submit"
          className="bg-black text-white py-2 rounded-md hover:bg-gray-800"
        >
          Register
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
