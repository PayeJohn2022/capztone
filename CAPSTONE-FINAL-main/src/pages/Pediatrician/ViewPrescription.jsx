import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5"; // Ensure the correct icon import

const ViewPrescription = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { prescription } = location.state || {};

  if (!prescription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl text-red-600">No prescription data available.</h1>
      </div>
    );
  }

  return (
    <div className="p-10 bg-green-100 min-h-screen">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 w-10 h-10 mr-4"
        >
          <IoArrowBack className="text-lg" />
        </button>
      </div>
      <div className="w-full max-w-4xl bg-white border border-gray-300 p-8 rounded-lg shadow-md">
       

        {/* Prescription Details */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Prescription Details</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">PTR ID: PTR-{prescription.id || "N/A"}</h2>
          <p className="text-gray-700">Patient Name: {prescription.patientName || "N/A"}</p>
          <p className="text-gray-700">Age: {prescription.age || "N/A"}</p>
          <p className="text-gray-700">Sex: {prescription.sex || "N/A"}</p>
          <p className="text-gray-700">Date: {prescription.date || "N/A"}</p>
          <p className="text-gray-700">Prescription:</p>
          <p className="text-gray-600">{prescription.details || "No prescription details available."}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewPrescription;
