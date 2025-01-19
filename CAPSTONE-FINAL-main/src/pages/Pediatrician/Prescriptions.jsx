import React, { useState } from 'react';
import axios from 'axios';
import logo from '../../assets/KiddieCare-Logo.png';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const PrescriptionPad = () => {
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientSex, setPatientSex] = useState('');
  const [date, setDate] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [prescriptionText, setPrescriptionText] = useState('');
  // const [prescriptionID, setPrescriptionText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const prescriptionDetails = {
      patientName,
      patientAge,
      patientSex,
      date,
      prescriptionText,
    };
  
    try {
      await axios.post(`${apiBaseUrl}/api/send-prescription`, {
        guardianEmail,
        prescriptionDetails,
      });
  
      alert('Prescription sent successfully');
    } catch (error) {
      console.error('Error sending prescription:', error);
      alert('Failed to send prescription');
    }
  };
  

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white border border-gray-300 p-8 rounded-lg shadow-md">
        <div className="flex items-start mb-6">
          {/* Medicine Image */}
          <span className="text-4xl text-green-500 mr-3">💊</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">KiddieCare</h1>
            <h2 className="text-lg font-semibold text-gray-700">Rx</h2>
          </div>
        </div>

        {/* Patient Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Patient's Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name:</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
                placeholder="Enter patient's name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age:</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
                placeholder="Enter age"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sex:</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
                value={patientSex}
                onChange={(e) => setPatientSex(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date:</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Guardian's Email */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Guardian's Information</h3>
          <label className="block text-sm font-medium text-gray-700">Guardian's Email:</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
            placeholder="Enter guardian's email address"
            value={guardianEmail}
            onChange={(e) => setGuardianEmail(e.target.value)}
          />
        </div>

        {/* Prescription Section */}
        <div className="border-t border-gray-300 pt-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Prescription</h3>
          <textarea
            rows="8"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
            placeholder="Enter prescription details here..."
            value={prescriptionText}
            onChange={(e) => setPrescriptionText(e.target.value)}
          ></textarea>
        </div>

        {/* Footer Section */}
        <div className="mt-8 text-center">
        {/* Doctor's Details */}
        <div className="text-center mb-6">
          <h1 className="text-1xl font-bold text-gray-800"><br /><br /><br /><br />JOUIE C. BACOT-URCIA, MD</h1>
          <h2 className="text-lg text-gray-700">Pediatrician</h2>
          <p className="text-sm text-gray-600">
            ACE Medical Center: Pimentel St. Lapasan, CDOC <br /><br />
          </p>
        </div>
          <p className="text-sm text-gray-700">License No: 0115531</p>
          <p className="text-sm text-gray-700">PTR No: need ID automated</p>
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Send Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPad;
