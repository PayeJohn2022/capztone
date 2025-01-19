import React, { useState } from 'react';
import backgroundImage from '../../assets/doctor.jpg';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    setShowOptions(true);
  };

  const handleLogin = () => {
    navigate('/LoginPage');
  };

  const handlerRegister = () => {
    navigate('/RegistrationPage');
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* Overlay for blur effect */}
      <div className="absolute inset-0 backdrop-blur-lg"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="flex flex-col md:flex-row max-w-6xl w-full p-4 mx-auto bg-gradient-to-r from-green-200 via-gray-200 to-gray-300 backdrop-blur-lg rounded-xl shadow-lg">
          {/* Image Section */}
          <div className="flex-1 flex items-center justify-center p-4 md:p-8">
            <img src={backgroundImage} alt='image' className="max-w-full h-auto rounded-lg shadow-lg" />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 sm:p-8 md:p-12  text-center flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700">Welcome to KiddieCare</h1>
            <p className="mt-4 text-sm sm:text-base md:text-lg text-green-600">
              An Online Consultation and Appointment Management Application for Pediatric Clinics.
            </p>

            {/* Let's Get Started button */}
            {!showOptions && (
              <button 
                onClick={handleGetStartedClick} 
                className="mt-6 px-4 py-2 sm:px-6 sm:py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all">
                Let's Get Started
              </button>
            )}

            {/* Show options for Login and Register */}
            {showOptions && (
              <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleLogin} 
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all">
                  Login
                </button>
                <button 
                  onClick={handlerRegister}
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all">
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
