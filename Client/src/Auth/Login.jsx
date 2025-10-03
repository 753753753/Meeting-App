import { signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import user from '../assets/LoginUser.png';
import { useUser } from '../context/UserContext';
import { auth, provider } from '../firebase';
import { googleLoginUser, loginUser } from '../utils/api';
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useUser();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      if (data.token) {
        login(data.user, data.token, data.role);
        navigate('/dashboard');
      } else {
         setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong. Please try again!');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      console.log(result)

      const data = await googleLoginUser(firebaseUser.email, firebaseUser.displayName, firebaseUser.uid, firebaseUser.photoURL);
      console.log("Google login response:", data);

      if (data.token) {
        login(data.user, data.token, data.role);
        navigate('/dashboard');
      } else {
        setError("Google login failed on server.");
      }
    } catch (err) {
      console.error("Google login error", err);
      setError("Google login failed.");
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
    <div className="flex w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden">
      
      {/* Left Illustration */}
      <div className="hidden md:flex items-center justify-center w-1/2 bg-[#1C1F2E] p-8 relative">
        <img
          src={user}
          alt="Login Illustration"
          className="w-auto h-auto relative z-10"
        />
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 px-10 py-4 flex flex-col justify-center bg-gray-950 text-white shadow-xl rounded-r-2xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold text-white/90">Welcome to</h2>
          <h1 className="text-5xl font-extrabold text-blue-600 mb-2">
            LINK UP
          </h1>
          <p className="mt-2 text-gray-300 text-sm sm:text-base">
            Connect, collaborate, and communicate seamlessly.
          </p>
        </div>

        {/* Google Login */}
        <div className="space-y-4">
          <button
            className="flex items-center justify-center w-full py-3 bg-white text-gray-800 font-semibold rounded-xl shadow hover:scale-105 transition-transform duration-200"
            onClick={handleGoogleLogin}
          >
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" className="mr-2" />
            Login with Google
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center text-gray-400">
          <hr className="flex-grow border-gray-600" />
          <span className="px-3 text-sm">OR</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-2 text-sm text-center">{error}</p>}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="flex items-center bg-[#1C1F2E] rounded-xl px-4 py-2">
            <span className="text-white/80 mr-2">📧</span>
            <input
              type="email"
              placeholder="example@gmail.com"
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
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm text-white/70">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="hover:underline text-blue-600">Forgot Password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow transition-all duration-200"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-white/70">
          Don’t have an account?
          <a href="/register" className="ml-1 underline font-medium text-blue-500 hover:text-blue-400">Register</a>
        </p>
      </div>
    </div>
  </div>
);



}
