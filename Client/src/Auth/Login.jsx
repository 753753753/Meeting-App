import React, { useState } from 'react';
import user from '../assets/LoginUser.png';
import { useUser } from '../context/UserContext';
import { loginUser } from '../utils/api';
import { useNavigate } from 'react-router-dom'; // If you are using React Router


export default function Login() {
  const [showPassword, setShowPassword] = useState(false); // Add this to your component's state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useUser(); // Access the login function from context
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Used for redirect after successful login

  const handleLogin = async (e) => {
    console.log(email, password)
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      if (data.token) {
        // If login is successful, save user info in context and redirect
        login(data.user, data.token);
        navigate('/dashboard'); // Redirect to the dashboard or another page
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong. Please try again!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-md overflow-hidden">
        {/* Left Illustration */}
        <div className="hidden md:flex items-center justify-center w-1/2 bg-[#1C1F2E] p-8">
          <img src={user} alt="Login Illustration" className="w-auto h-auto" />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 ">
          <h2 className="text-2xl font-semibold">Welcome to</h2>
          <h1 className="text-3xl font-bold text-purple-600 mb-6">LiveMeet</h1>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="flex items-center justify-center w-full py-3 bg-white border rounded-md shadow hover:shadow-md transition">
              <img src="https://img.icons8.com/color/16/000000/google-logo.png" className="mr-2" />
              Login with Google
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-gray-500">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Email and Password */}
          {error && <p className="error mb-2">{error}</p>}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="flex items-center bg-gray-200 rounded-md px-3 py-2">
              <span className="text-gray-500 mr-2">
                📧
              </span>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full bg-transparent outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center bg-gray-200 rounded-md px-3 py-2">
              <span className="text-gray-500 mr-2">🔑</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-transparent outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="text-gray-500 cursor-pointer ml-2"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-purple-600 hover:underline">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition"
            >
              Login
            </button>
          </form>

          {/* Register */}
          <p className="text-sm text-center mt-6">
            Don’t have an account?
            <a href="/register" className="text-purple-600 ml-1 hover:underline">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}
