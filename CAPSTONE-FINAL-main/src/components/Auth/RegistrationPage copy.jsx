import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import logo from '../../assets/doctor.jpg';
import doctorImage from '../../assets/doctor.jpg';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lastname: '',
    firstname: '',
    middlename: '',
    extension: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: '',
    userType: '',
    guardianAddress: '',
    clinicAddress: '', 
    specialization: '', 
  });
  const [patientDetails, setPatientDetails] = useState ({
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

  const [showGuardianFields, setShowGuardianFields] = useState(false);
  const [showPediatricianFields, setShowPediatricianFields] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setPatientDetails({ ...patientDetails, [name]: value });
  };

  const handleUserTypeChange = (e) => {
    const selectedUserType = e.target.value;
    setFormData({ ...formData, userType: selectedUserType });

    setShowGuardianFields(selectedUserType === 'Guardian');
    setShowPediatricianFields(selectedUserType === 'Pediatrician');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // Patient details validation for Guardian
    if (formData.userType === 'Guardian') {
      const requiredFields = [
        'patientName', 'patientAge', 'birthdate', 'sex', 'birthplace', 'religion',
        'fatherName', 'fatherAge', 'fatherOccupation', 'motherName', 'motherAge',
        'motherOccupation', 'cellphone', 'patientEmail', 'informant', 'address', 
        'relation', 'medicalHistory'
      ];

      for (const field of requiredFields) {
        if (!patientDetails[field]) {
          alert(`Please fill in all required fields for patient information: ${field}`);
          return;
        }
      }
    }
    // Prepare the data to send
    const userData = {
      ...formData,
      patientInfo: showGuardianFields ? patientDetails : null,
    };

    try {
      // Assuming your backend is running on localhost:5000
      const response = await axios.post(`${apiBaseUrl}/api/register`, userData);

      if (response.status === 201) {
        alert('Registration successful');
        setFormData({
          lastname: '',
          firstname: '',
          middlename: '',
          extension: '',
          email: '',
          contact: '',
          password: '',
          confirmPassword: '',
          userType: '',
          guardianAddress: '',
          clinicAddress: '', 
          specialization: '', 
        });
        setPatientDetails({
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
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      if (error.response) {
        alert(`Registration failed: ${error.response.data.message}`);
      } else {
        alert('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center overflow-y-auto px-6 py-10"
      style={{ backgroundImage: `url(${doctorImage})` }}
    >
      {/* Registration Form Container */}
      <div className="flex flex-row w-[90%] max-w-6xl p-8 bg-white border-2 border-gray-900 rounded-lg shadow-lg space-x-8">
        {/* Left Side: Intro and Navigation */}
        <div className="hidden lg:flex flex-col justify-center items-start w-1/3 bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome!</h2>
          <p className="text-gray-700 mb-8">
            Fill out the form to create your account and access our features.
          </p>
          <img
            src={logo}
            alt="welcome illustration"
            className="h-96 w-full object-cover rounded-lg"
          />
        </div>

        {/* Right Side: Form */}
        <div className="flex flex-col w-full lg:w-2/3">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Create an Account!
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type */}
            <div>
              <label className="block text-sm font-semibold mb-1">User Type</label>
              <select
                name="userType"
                className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                value={formData.userType}
                onChange={handleUserTypeChange}
                required
              >
                <option value="">Select User Type</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>
            {/* Guardian Fields */}
            {showGuardianFields && (
            <div className="w-full">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Middle Name</label>
                <input
                  type="text"
                  name="middlename"
                  placeholder="Middle Name"
                  value={formData.middlename}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Name Extension</label>
                <input
                  type="text"
                  name="extension"
                  placeholder="Name Extension (e.g. Jr.)"
                  value={formData.extension}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  placeholder="Contact Number"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">Guardian Address</label>
                <input
                  type="text"
                  name="guardianAddress"
                  placeholder="Guardian Address"
                  value={formData.guardianAddress}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  minLength={8}
                  maxLength={12}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  minLength={8}
                  maxLength={12}
                />
              </div>
              </div>
              <div className="mt-4 w-full">
              <h2 className="text-xl font-bold text-center mb-2">Register Patient </h2>
              <div className="mb-4">
                <label className="w-full text-left text-sm font-semibold mb-1">Patient Name (Lastname, Firstname, Middle Initial)</label>
                <input
                  type="text"
                  name="patientName"
                  placeholder="(Lastname, Firstname, Middle Initial)"
                  value={patientDetails.patientName}
                  onChange={handlePatientChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="w-full text-left text-sm font-semibold mb-1">Patient Age</label>
                <input
                  type="number"
                  name="patientAge"
                  placeholder="Patient Age"
                  value={patientDetails.patientAge}
                  onChange={handlePatientChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="w-full text-left text-sm font-semibold mb-1">Birthdate</label>
                <input
                  type="date"
                  name="birthdate"
                  value={patientDetails.birthdate}
                  onChange={handlePatientChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="w-full text-left text-sm font-semibold mb-1">Sex</label>
                  <select
                    id="sex"
                    name="sex"
                    value={patientDetails.sex}
                    onChange={handlePatientChange}
                    className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="w-full text-left text-sm font-semibold mb-1">Birthplace</label>
                  <input
                    type="text"
                    name="birthplace"
                    placeholder="Birthplace"
                    value={patientDetails.birthplace}
                    onChange={handlePatientChange}
                    className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="w-full text-left text-sm font-semibold mb-1">Religion</label>
                <input
                  type="text"
                  name="religion"
                  placeholder="Religion"
                  value={patientDetails.religion}
                  onChange={handlePatientChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="w-full text-left text-sm font-semibold mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={patientDetails.address}
                  onChange={handlePatientChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="w-full text-left text-sm font-semibold mb-1">Father's Name (Lastname, Firstname, Middle Initial)</label>
                  <input
                    type="text"
                    name="fatherName"
                    placeholder="(Lastname, Firstname, Middle Initial)"
                    value={patientDetails.fatherName}
                    onChange={handlePatientChange}
                    className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="w-full text-left text-sm font-semibold mb-1">Father's Age</label>
                  <input
                    type="number"
                    name="fatherAge"
                    placeholder="Father's Age"
                    value={patientDetails.fatherAge}
                    onChange={handlePatientChange}
                    className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="w-full text-left text-sm font-semibold mb-1">Father's Occupation</label>
                  <input
                    type="text"
                    name="fatherOccupation"
                    placeholder="Father's Occupation"
                    value={patientDetails.fatherOccupation}
                    onChange={(e) => {
                      console.log("Father's Occupation changed to:", e.target.value); // Debugging line
                      setPatientDetails({ ...patientDetails, fatherOccupation: e.target.value });
                    }}
                    className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="w-full text-left text-sm font-semibold mb-1">Mother's Name (Lastname, Firstname, Middle Initial)</label>
                  <input
                    type="text"
                    name="motherName"
                    placeholder="(Lastname, Firstname, Middle Initial)"
                    value={patientDetails.motherName}
                    onChange={handlePatientChange}
                    className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="w-full text-left text-sm font-semibold mb-1">Mother's Age</label>
                  <input
                    type="number"
                    name="motherAge"
                    placeholder="Mother's Age"
                    value={patientDetails.motherAge}
                    onChange={handlePatientChange}
                    className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="w-full text-left text-sm font-semibold mb-1">Mother's Occupation</label>
                  <input
                    type="text"
                    name="motherOccupation"
                    placeholder="Mother's Occupation"
                    value={patientDetails.motherOccupation}
                    onChange={handlePatientChange}
                    className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="w-full text-left text-sm font-semibold mb-1">Cellphone Number(s)</label>
                <input
                  type="tel"
                  name="cellphone"
                  placeholder="Cellphone Number(s)"
                  value={patientDetails.cellphone}
                  onChange={handlePatientChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="w-full text-left text-sm font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  name="patientEmail"
                  placeholder="Email Address"
                  value={patientDetails.patientEmail}
                  onChange={handlePatientChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="w-full text-left text-sm font-semibold mb-1">Informant</label>
                <input
                  type="text"
                  name="informant"
                  placeholder="Informant"
                  value={patientDetails.informant}
                  onChange={handlePatientChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="mb-4">
                <label className="w-full text-left text-sm font-semibold mb-1">Relation to Patient</label>
                <input
                  type="text"
                  name="relation"
                  placeholder="Relation to Patient"
                  value={patientDetails.relation}
                  onChange={handlePatientChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="w-full text-left text-sm font-semibold mb-1">Medical History</label>
                <textarea
                  name="medicalHistory"
                  placeholder="Medical History"
                  value={patientDetails.medicalHistory}
                  onChange={handlePatientChange}
                  className="w-full p-3 border-2 rounded-lg border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  required
                />
              </div>
            </div>
            </div>
            )}
            {/* Pediatrician Fields */}
            {showPediatricianFields && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Middle Name</label>
                <input
                  type="text"
                  name="middlename"
                  placeholder="Middle Name"
                  value={formData.middlename}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Name Extension</label>
                <input
                  type="text"
                  name="extension"
                  placeholder="Name Extension (e.g. Jr.)"
                  value={formData.extension}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  placeholder="Contact Number"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Clinic Address</label>
                <input
                  type="text"
                  name="clinicAddress"
                  placeholder="Clinic Address"
                  value={formData.clinicAddress}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  placeholder="Specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  minLength={8}
                  maxLength={12}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 border-2 rounded-full border-gray-500 bg-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  minLength={8}
                  maxLength={12}
                />
              </div>
            </div>
            )}
            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full py-3 text-white bg-green-500 rounded-full text-lg font-semibold hover:bg-green-600"
            >
              Sign Up
            </button>
          </form>

          {/* Already Registered */}
          <div className="mt-4 text-center">
            <p className="text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                Proceed to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;