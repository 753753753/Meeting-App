import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Used for redirect
import user from '../assets/LoginUser.png';
import bg from "../assets/bg.jpg";
import { useUser } from '../context/UserContext';
import { AdminregisterUser } from '../utils/api';
export default function AdminRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Redirect after successful registration
  const { login } = useUser(); // Access the login function from context
  const [showPassword, setShowPassword] = useState(false);
  
  const handleRegister = async (e) => {
    console.log(name, email, password)
    e.preventDefault();
    try {
      const data = await AdminregisterUser(name, email, password);
      if (data.token) {
        // If registration is successful, save the token and user in context
        login(data.user, data.token, data.role);
        navigate('/dashboard'); // Redirect to login page after successful registration
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again!');
    }
  };

  return (
  <div
    className="min-h-screen flex items-center justify-center p-4 bg-gray-950"
  >
    <div className="flex w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden bg-white/10 backdrop-blur-md">

      {/* Left Illustration */}
      <div className="hidden md:flex items-center justify-center w-1/2 bg-[#1C1F2E] relative p-8">
        <img
          src={user}
          alt="Admin Illustration"
          className="relative w-auto h-auto z-10"
        />
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 px-10 py-8 flex flex-col justify-center bg-gray-950 text-white shadow-xl rounded-r-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold text-white/90">Admin Registration</h2>
          <h1 className="text-5xl font-extrabold text-blue-600 mb-2">
            LINK UP
          </h1>
          <p className="mt-2 text-gray-200/80 text-sm sm:text-base">
            Create your admin account to manage meetings and users.
          </p>
        </div>

        {/* Form */}
        {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="flex items-center bg-[#1C1F2E] rounded-xl px-4 py-2">
            <span className="text-white/80 mr-2">🙍‍♂️</span>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-transparent outline-none placeholder-white/70 text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center bg-[#1C1F2E] rounded-xl px-4 py-2">
            <span className="text-white/80 mr-2">📧</span>
            <input
              type="email"
              placeholder="admin@example.com"
              className="w-full bg-transparent outline-none placeholder-white/70 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center bg-[#1C1F2E] rounded-xl px-4 py-2">
            <span className="text-white/80 mr-2">🔑</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-transparent outline-none placeholder-white/70 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="text-white/80 cursor-pointer ml-2"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg transition-all duration-200"
          >
            Register Admin
          </button>
        </form>

        {/* Already have an account */}
        <p className="text-sm text-center mt-6 text-white/70">
          Already have an account?
          <a href="/login" className="ml-1 underline font-medium text-blue-400 hover:text-blue-300">
            Login
          </a>
        </p>
      </div>
    </div>
  </div>
);

}
