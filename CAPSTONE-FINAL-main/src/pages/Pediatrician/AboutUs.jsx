import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { ArrowLeftIcon } from '@heroicons/react/24/solid'; // Import the back arrow icon from Heroicons

import teamLeaderImage from '../../assets/jhorne.jpg';
import frontendDevImage from '../../assets/lessa.jpg';
import backendDevImage from '../../assets/jhorne.jpg';
import researcherImage from '../../assets/era.jpg';

const AboutUs = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Back Icon Button */}
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="absolute top-6 left-6 flex items-center text-green-700 hover:text-blue-800 mb-4"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" /> {/* Back arrow icon */}
        Back to Profile
      </button>

      {/* Main Content - Centered */}
      <div className="flex flex-col items-center justify-center p-6 bg-gray-50 min-h-screen">
        {/* About Us Section */}
        <h1 className="text-3xl font-bold mb-8 mt-10">About Us</h1>
        <p className="text-center max-w-2xl mb-8">
          Welcome to KiddieCare, your trusted partner in pediatric health! Our mission is to provide exceptional online consultation and appointment management services for guardians and pediatricians. We understand that children’s health is a priority, and we are here to ensure that every consultation is accessible, safe, and efficient.
        </p>

        <h2 className="text-2xl font-semibold mb-8">Meet Our Team</h2>

        <div className="flex justify-center gap-10 mb-8">
          {/* Team Leader */}
          <div className="flex flex-col items-center">
            <img
              src={teamLeaderImage} 
              alt="Team Leader"
              className="w-48 h-48 rounded-full border-4 border-green-600 mb-2"
            />
            <p className="font-semibold">John Dwight Paye</p> {/* Team Leader Name */}
            <p className="text-sm text-gray-600">Team Leader</p> {/* Team Leader Title */}
          </div>

          {/* Frontend Developer */}
          <div className="flex flex-col items-center">
            <img
              src={frontendDevImage} 
              alt="Frontend Developer"
              className="w-48 h-48 rounded-full border-4 border-green-600 mb-2"
            />
            <p className="font-semibold">Lessa Mae Ebarle</p> {/* Frontend Developer Name */}
            <p className="text-sm text-gray-600">Frontend Developer</p> {/* Frontend Developer Title */}
          </div>

          {/* Backend Developer */}
          <div className="flex flex-col items-center">
            <img
              src={backendDevImage} 
              alt="Backend Developer"
              className="w-48 h-48 rounded-full border-4 border-green-600 mb-2"
            />
            <p className="font-semibold">Jhorne Bhoy Acenas</p> {/* Backend Developer Name */}
            <p className="text-sm text-gray-600">Backend Developer</p> {/* Backend Developer Title */}
          </div>

          {/* Researcher */}
          <div className="flex flex-col items-center">
            <img
              src={researcherImage} 
              alt="Researcher"
              className="w-48 h-48 rounded-full border-4 border-green-600 mb-2"
            />
            <p className="font-semibold">Era Mae Dalura</p> {/* Researcher Name */}
            <p className="text-sm text-gray-600">Researcher</p> {/* Researcher Title */}
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-lg">For any inquiries or support, feel free to reach out to us:</p>
          <p className="text-md">Email: <a href="mailto:support@kiddiecare.com" className="text-green-600">support@kiddiecare.com</a></p>
          <p className="text-md">Phone: <a href="tel:09157270949" className="text-green-600">+1 234-567-890</a></p>
          <p className="text-md">Address: Ace Medical Center, Lapasan, Cagayan de Oro City</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
