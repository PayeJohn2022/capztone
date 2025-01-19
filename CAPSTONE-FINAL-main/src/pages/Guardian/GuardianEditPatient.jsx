import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoArrowBack } from 'react-icons/io5'; // Ensure the icon is imported

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const GuardianEditPatient = () => {
  const navigate = useNavigate();
  const [patientDetails, setPatientDetails] = useState({
    patientName: '',
    patientAge: '',
    birthdate: '',
    sex: '',
    birthplace: '',
    religion: '',
    address: '',
    fatherName: '',
    fatherAge: '',
    fatherOccupation: '',
    motherName: '',
    motherAge: '',
    motherOccupation: '',
    cellphone: '',
    patientEmail: '',
    informant: '',
    relation: '',
    medicalHistory: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const guardianEmail = localStorage.getItem('email');

      const response = await axios.post(
        `${apiBaseUrl}/api/patient/register`,
        { ...patientDetails, guardianEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert('Patient registered successfully!');
        navigate('/guardian/patients');
      }
    } catch (error) {
      console.error('Error registering patient:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Failed to register patient. Please try again.');
      }
    }
  };

  return (
    <div className="bg-green-100 min-h-screen p-8 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)} // Navigate back to the previous page
        className="absolute top-6 left-6 flex items-center justify-center bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 w-10 h-10"
      >
        <IoArrowBack className="text-lg" />
      </button>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 mt-20">
        <h1 className="text-2xl font-bold text-center text-green-800 mb-6">
          Edit Patient
        </h1>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name
              </label>
              <input
                type="text"
                name="patientName"
                placeholder="(Lastname, Firstname, Middle Initial)"
                value={patientDetails.patientName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Patient Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="patientAge"
                value={patientDetails.patientAge}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Birthdate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birthdate
              </label>
              <input
                type="date"
                name="birthdate"
                value={patientDetails.birthdate}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Sex */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sex
              </label>
              <select
                name="sex"
                value={patientDetails.sex}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Birthplace */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birthplace
              </label>
              <input
                type="text"
                name="birthplace"
                placeholder="Enter birthplace"
                value={patientDetails.birthplace}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Religion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Religion
              </label>
              <input
                type="text"
                name="religion"
                placeholder="Enter religion"
                value={patientDetails.religion}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Enter Address"
                value={patientDetails.address}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father's Name
              </label>
              <input
                type="text"
                name="fatherName"
                placeholder="Enter Father's Name"
                value={patientDetails.fatherName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father's Age
              </label>
              <input
                type="number"
                name="fatherAge"
                placeholder="Enter Father's Age"
                value={patientDetails.fatherAge}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father's Occupation
              </label>
              <input
                type="text"
                name="fatherOccupation"
                placeholder="Enter Father's Occupation"
                value={patientDetails.fatherOccupation}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mother's Name
              </label>
              <input
                type="text"
                name="motherName"
                placeholder="Enter Mother's Name"
                value={patientDetails.motherName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mother's Age
              </label>
              <input
                type="number"
                name="motherAge"
                placeholder="Enter mother's Age"
                value={patientDetails.motherAge}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mother's Occupation
              </label>
              <input
                type="text"
                name="motherOccupation"
                placeholder="Enter Mother's Occupation"
                value={patientDetails.motherOccupation}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cellphone
              </label>
              <input
                type="text"
                name="cellphone"
                placeholder="Enter Cellphone Number"
                value={patientDetails.cellphone}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Email
              </label>
              <input
                type="text"
                name="patientEmail"
                placeholder="Enter Patient's Email"
                value={patientDetails.patientEmail}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relation
              </label>
              <input
                type="text"
                name="relation"
                placeholder="Enter Relation"
                value={patientDetails.relation}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Informant
              </label>
              <input
                type="text"
                name="informant"
                placeholder="Enter Informant"
                value={patientDetails.informant}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {/* Medical History */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical History
              </label>
              <textarea
                name="medicalHistory"
                value={patientDetails.medicalHistory}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                rows={4}
                required
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuardianEditPatient;