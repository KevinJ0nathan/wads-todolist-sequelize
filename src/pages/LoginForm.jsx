import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If there's a token already in localStorage, navigate directly to the todo page
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/todolist");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      const response = await axios.post("http://localhost:3000/api/users/login", {
        email,
        password,
      });

      // Store JWT token in localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/todolist"); // Redirect to todo page
      }
    } catch (err) {
      console.error("Login error:", err);
      // Set error message for display
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex flex-col gap-5 rounded-lg bg-white shadow-md w-full max-w-sm p-5 sm:p-7 md:w-[400px]">
      <h1 className="text-xl font-semibold text-gray-700 text-center">
        Login to your account
      </h1>
      <form className="flex flex-col text-black gap-4" onSubmit={handleLogin}>
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-start">Email</label>
            <input
              type="email"
              name="email"
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
              name="password"
              placeholder="Enter your password"
              className="py-2 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-black text-white py-2 rounded-md hover:bg-gray-800"
        >
          Login
        </button>

        <p className="text-center text-sm">Don't have an account?</p>

        <p className="text-center text-sm">
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
