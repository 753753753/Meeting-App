import React, { useState } from 'react';
import { registerUser , googleRegisterUser} from '../utils/api';
import { useNavigate } from 'react-router-dom'; // Used for redirect
import { useUser } from '../context/UserContext';
import user from '../assets/LoginUser.png';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Redirect after successful registration
  const { login } = useUser(); // Access the login function from context

  const handleRegister = async (e) => {
    console.log(name , email , password)
    e.preventDefault();
    try {
      const data = await registerUser(name, email, password);
      console.log(data); // Log the response to see what is returned
      if (data.token) {
        // If registration is successful, save the token and user in context
        login(data.user, data.token , data.role);
        navigate('/dashboard'); // Redirect to login page after successful registration
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again!');
    }
  };


   const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Send data to your backend (you must create this endpoint)
      const data = await googleRegisterUser(firebaseUser.email, firebaseUser.displayName, firebaseUser.uid);
      console.log("Google signup response:", data);

      if (data.token) {
        login(data.user, data.token, data.role);
        navigate('/dashboard');
      } else {
        setError("Google signup failed on server.");
      }
    } catch (err) {
      console.error("Google signup error", err);
      setError("Google signup failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-md overflow-hidden">
        {/* Left Illustration */}
        <div className="hidden md:flex items-center justify-center w-1/2 bg-[#1C1F2E] p-8">
          <img
            src={user}
            alt="Register Illustration"
            className="w-auto h-auto"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold">Join us at</h2>
          <h1 className="text-3xl font-bold text-purple-600 mb-6">LINK UP</h1>

          {/* Social Sign Up */}
          <div className="space-y-3">
            <button className="flex items-center justify-center w-full py-3 bg-white border rounded-md shadow hover:shadow-md transition" onClick={handleGoogleSignup}>
              <img src="https://img.icons8.com/color/16/000000/google-logo.png" className="mr-2" />
              Sign up with Google
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <hr className="flex-grow border-gray-300" />
            <span className="px-3 text-gray-500">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Name, Email, Password Fields */}
          {error && <p className="error mb-2">{error}</p>}
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="flex items-center bg-gray-200 rounded-md px-3 py-2">
              <span className="text-gray-500 mr-2">🙍‍♂️</span>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full bg-transparent outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center bg-gray-200 rounded-md px-3 py-2">
              <span className="text-gray-500 mr-2">📧</span>
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
                type="password"
                placeholder="Password"
                className="w-full bg-transparent outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="text-gray-500 cursor-pointer ml-2">👁</span>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition"
            >
              Register
            </button>
          </form>

          {/* Already have an account */}
          <p className="text-sm text-center mt-6">
            Already have an account?
            <a href="/login" className="text-purple-600 ml-1 hover:underline">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}
