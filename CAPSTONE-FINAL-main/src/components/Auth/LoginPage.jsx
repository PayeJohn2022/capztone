import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // To make API requests
import 'flowbite'; // Import Flowbite components
import doctorImage from "../../assets/doctor.jpg";
import { jwtDecode } from 'jwt-decode';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  


  // Handle form submission for login
  const handleLogin = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const response = await axios.post(`${apiBaseUrl}/api/login`, { email, password });
    const { token, userType } = response.data;

    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
    
      console.log('Decoded token:', decoded);
    
      // Check if token is expired
      if (decoded.exp < currentTime) {
        console.log('Token expired. Please login again.');
      } else {
        console.log('Token is valid.');
      }
    
      // Save the token
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      console.log('Token saved to localStorage:', localStorage.getItem('token'));
      console.log('Email saved to localStorage:', localStorage.getItem('email'));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (userType === 'Guardian') {
        navigate('/guardian/dashboard');
      } else if (userType === 'Admin') {
        navigate('/admin/dashboard');
      } else if (userType === 'Pediatrician') {
        navigate('/pediatrician/dashboard');
      }
    }
  } catch (err) {
    if (err.response && err.response.status === 403) {
      setError('Your email is not verified. Please verify your email and try again.');
    } else {
      setError('Invalid login credentials.');
    }
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 via-gray-200 to-gray-300 backdrop-blur-lg p-6">
      {/* Wrapper Div for Both Sections */}
      <div className="sm:h-[700px] lg:h-[500px] md:h-[500px] flex flex-col md:flex-row max-w-6xl w-full bg-white rounded-lg shadow-lg overflow-hidden">

        {/* Left Section with Image */}
        <div className="md:w-1/2 w-full bg-cover h-full lg:h-[500px]" style={{ backgroundImage: `url(${doctorImage})` }}>
          <div className="h-full lg:h-[500px] flex flex-col justify-center items-center text-center text-green-900 p-6 backdrop-blur-sm">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Kiddie Care</h1>
            <p className="text-x1 md:text-xl">An online consultation and appointment management application.</p>
          </div>
        </div>

        {/* Right Section with Login Form */}
        <div className="w-full md:w-1/2 p-2 md:p-8 sm:p-8">
          <div className="w-full max-w-xs mx-auto sm:h-[450px] lg:h-[500px] md:h-[450px]">
            <h2 className="text-2xl md:text-4xl font-bold text-green-900 mb-6 text-center">Welcome Back</h2>

            {/* Show error message if login fails */}
            {error && <div className="text-red-600 text-center mb-4">{error}</div>}

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block mb-2 text-sm sm:text-base sm:text-lg font-medium text-gray-900">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full h-12 text-sm sm:text-base sm:text-lg font-medium px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm sm:text-base sm:text-lg font-medium text-gray-900">Password</label>
                <input
                  type="password"
                  id="password"
                  className="w-full h-12 text-sm sm:text-base sm:text-lg font-medium px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-between items-center">
                <Link to="/forgot-password" className="text-sm sm:text-base sm:text-lg font-medium text-blue-600 hover:underline">Forgot your password?</Link>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-900 transition duration-300"
              >
                LOGIN
              </button>
            </form>

            <p className="mt-4 text-sm sm:text-base sm:text-lg font-medium text-center text-gray-500">
              Don't have an account?
              <Link to="/RegistrationPage" className="text-sm sm:text-base sm:text-lg font-medium text-blue-600 hover:underline"> Register Now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
