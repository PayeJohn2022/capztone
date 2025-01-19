import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = '${import.meta.env.VITE_API_BASE_URL}/api/consultations'; // Replace with your Django backend URL if different

const RequestConsultation = () => {
  const [formData, setFormData] = useState({ name: '', email: '', date: '', time: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      console.log('Response:', response); // Log response
      alert('Consultation requested successfully!');
      setFormData({ name: '', email: '', date: '', time: '' }); // Reset form fields
    } catch (error) {
      console.error('Failed to request consultation:', error.response ? error.response.data : error.message);
      setError('Failed to request consultation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white flex flex-col items-center">
      <h2 className="w-full md:w-64 mt-16 text-xl font-bold text-green-700 text-center md:text-left">Request Consultation</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 mt-8 md:mt-16">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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

export default RequestConsultation;
