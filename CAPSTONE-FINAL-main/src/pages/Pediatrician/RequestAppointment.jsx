import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = '${import.meta.env.VITE_API_BASE_URL}/api/appointments'; // Replace with your Django backend URL if different

const RequestAppointment = () => {
  const [formData, setFormData] = useState({ patient_name: '', date: '', time: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appId, setAppId] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      console.log('Form Data:', formData); // Log form data
      const response = await axios.post(API_BASE_URL, formData); // Capture the response
      setAppId(response.data.app_id);
      console.log('Response:', response); // Log response
      alert('Appointment requested successfully!');
      setFormData({ patient_name: '', date: '', time: '', description: '' }); // Reset form fields
    } catch (error) {
      console.error('Failed to request appointment:', error.response ? error.response.data : error.message);
      setError('Failed to request appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white flex flex-col items-center">
      <h2 className="w-full md:w-64 mt-16 text-xl font-bold text-green-700 text-center md:text-left">Request Appointment</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 mt-8 md:mt-16">
        <input
          type="text"
          name="patient_name"
          placeholder="Patient Name"
          value={formData.patient_name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows="7" // Adjust the number of rows as needed
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default RequestAppointment;
