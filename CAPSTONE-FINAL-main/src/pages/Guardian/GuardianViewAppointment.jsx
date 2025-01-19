import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const GuardianViewAppointment = () => {
  const { appointmentId } = useParams(); // Get appointment ID from route params
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Appointment ID:', appointmentId); 
    const fetchAppointmentDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiBaseUrl}/api/get-appointments/${appointmentId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAppointment(response.data);
      } catch (err) {
        console.error('Error fetching appointment details:', err);
        setError('Failed to fetch appointment details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId]);

  const handleBack = () => navigate(-1); // Navigate back
  const handleEdit = () => console.log('Edit appointment:', appointmentId); // Placeholder for edit functionality
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`${apiBaseUrl}/api/appointments/${appointmentId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        alert('Appointment deleted successfully.');
        navigate('/guardian/appointments'); // Navigate to the appointments list
      } catch (err) {
        console.error('Error deleting appointment:', err);
        alert('Failed to delete appointment. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="text-center text-lg text-green-800">Loading appointment details...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-br from-green-50 to-green-100 relative">
      {/* Back Button */}
      <button
        onClick={handleBack}
        aria-label="Go back"
        className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <IoArrowBack className="text-lg" />
      </button>

      {/* Appointment Details */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl w-full">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Appointment Details</h2>
        <div className="text-gray-700 text-lg space-y-4">
          <p>
            <strong>Type:</strong> <span className="font-semibold">Appointment</span>
          </p>
          <p>
            <strong>Guardian Name:</strong> <span className="font-semibold">{appointment.guardianFullName}</span>
          </p>
          <p>
            <strong>Email:</strong> <span className="font-semibold">{appointment.guardianEmail}</span>
          </p>
          <p>
            <strong>Patient Name:</strong> <span className="font-semibold">{appointment.patientFullName}</span>
          </p>
          <p>
            <strong>Age:</strong> <span className="font-semibold">{appointment.patientAge}</span>
          </p>
          <p>
            <strong>Schedule Date:</strong>{' '}
            <span className="font-semibold">{new Date(appointment.date).toLocaleDateString()}</span>
          </p>
          <p>
            <strong>Schedule Time:</strong>{' '}
            <span className="font-semibold">
              {appointment.timeStart} - {appointment.timeEnd}
            </span>
          </p>
          <p>
            <strong>Description:</strong> <span className="font-semibold">{appointment.description}</span>
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                appointment.status.toLowerCase() === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : appointment.status.toLowerCase() === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {appointment.status}
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleEdit}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </main>
  );
};

export default GuardianViewAppointment;
