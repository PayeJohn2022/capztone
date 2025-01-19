import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import teamLeaderImage from '../../assets/jhorne.jpg';
import frontendDevImage from '../../assets/lessa.jpg';
import backendDevImage from '../../assets/jhorne.jpg';
import researcherImage from '../../assets/era.jpg';

const GuardianAboutUs = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleBack = () => navigate(-1); // Navigate back

  return (
    <div className="flex flex-col items-center bg-green-50 min-h-screen py-10 px-6 relative">
      {/* Back Button */}
      <button
        onClick={handleBack}
        aria-label="Go back"
        className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <span className="text-xl font-bold">&larr;</span>
      </button>

      <h1 className="text-4xl font-extrabold text-green-700 mb-6 text-center">About Us</h1>
      <p className="text-xl text-gray-700 max-w-4xl text-center mb-8 leading-relaxed">
        Welcome to KiddieCare, your trusted partner in pediatric health! Our mission is to provide exceptional online consultation and appointment management services for guardians and pediatricians. We understand that children’s health is a priority, and we are here to ensure that every consultation is accessible, safe, and efficient.
      </p>
      
      <h2 className="text-3xl font-semibold text-green-600 mb-10 text-center">Meet Our Team</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mb-10">
        {/* Team Leader */}
        <div className="flex flex-col items-center shadow-lg rounded-xl overflow-hidden bg-white p-6 hover:scale-105 transform transition-all">
          <img
            src={teamLeaderImage}
            alt="Team Leader"
            className="w-48 h-48 rounded-full border-4 border-green-600 mb-4"
          />
          <p className="font-semibold text-xl text-gray-800">John Dwight Paye</p>
          <p className="text-sm text-gray-600">Team Leader</p>
        </div>

        {/* Frontend Developer */}
        <div className="flex flex-col items-center shadow-lg rounded-xl overflow-hidden bg-white p-6 hover:scale-105 transform transition-all">
          <img
            src={frontendDevImage}
            alt="Frontend Developer"
            className="w-48 h-48 rounded-full border-4 border-green-600 mb-4"
          />
          <p className="font-semibold text-xl text-gray-800">Lessa Mae Ebarle</p>
          <p className="text-sm text-gray-600">Frontend Developer</p>
        </div>

        {/* Backend Developer */}
        <div className="flex flex-col items-center shadow-lg rounded-xl overflow-hidden bg-white p-6 hover:scale-105 transform transition-all">
          <img
            src={backendDevImage}
            alt="Backend Developer"
            className="w-48 h-48 rounded-full border-4 border-green-600 mb-4"
          />
          <p className="font-semibold text-xl text-gray-800">Jhorne Bhoy Acenas</p>
          <p className="text-sm text-gray-600">Backend Developer</p>
        </div>

        {/* Researcher */}
        <div className="flex flex-col items-center shadow-lg rounded-xl overflow-hidden bg-white p-6 hover:scale-105 transform transition-all">
          <img
            src={researcherImage}
            alt="Researcher"
            className="w-48 h-48 rounded-full border-4 border-green-600 mb-4"
          />
          <p className="font-semibold text-xl text-gray-800">Era Mae Dalura</p>
          <p className="text-sm text-gray-600">Researcher</p>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl mx-auto mb-10">
        <h2 className="text-2xl font-semibold text-green-600 mb-6 text-center">Contact Us</h2>
        <p className="text-lg text-gray-700 mb-6 text-center">For any inquiries or support, feel free to reach out to us:</p>
        <div className="text-center mb-6">
          <p className="text-md text-gray-600">Email: 
            <a href="mailto:support@kiddiecare.com" className="text-green-600 hover:underline"> support@kiddiecare.com</a>
          </p>
          <p className="text-md text-gray-600">Phone: 
            <a href="tel:09157270949" className="text-green-600 hover:underline"> +1 234-567-890</a>
          </p>
          <p className="text-md text-gray-600">Address: Ace Medical Center, Lapasan, Cagayan de Oro City</p>
        </div>
        <a
          href="mailto:support@kiddiecare.com"
          className="block mx-auto bg-green-600 text-white py-3 px-6 rounded-full hover:bg-green-700 transition-all"
        >
          Get in Touch
        </a>
      </div>

      {/* Footer Section */}
      <footer className="w-full bg-green-600 text-white py-6 mt-20">
        <div className="text-center">
          <p className="text-lg">&copy; 2024 KiddieCare | All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default GuardianAboutUs;
