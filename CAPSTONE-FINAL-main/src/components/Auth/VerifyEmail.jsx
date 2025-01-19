import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import doctorImage from "../../assets/doctor.jpg";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const token = new URLSearchParams(window.location.search).get('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage('Invalid or missing token.');
      return;
    }

    const timeout = setTimeout(() => navigate('/login'), 3000);

    axios.get(`${apiBaseUrl}/api/verify-email?token=${token}`)
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        setMessage(error.response?.data?.message || 'Verification failed.');
      });

    return () => clearTimeout(timeout);
  }, [token, navigate]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{ backgroundImage: `url(${doctorImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-md"></div>
      <div className="p-8 bg-white bg-opacity-75 shadow-lg rounded-lg max-w-md w-full z-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Email Verification</h1>
        <p className="text-lg text-center text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default VerifyEmail;
