import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const PediatricianViewAppointment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiBaseUrl}/api/get-appointments-pediatrician/${appointmentId}`, {
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

  if (loading) {
    return <div className="text-center text-lg text-green-800">Loading appointment details...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500">{error}</div>;
  }

  return (
    <main className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-br from-blue-50 to-blue-100 relative">
      {/* Back Button */}
      <button
        onClick={handleBack}
        aria-label="Go back"
        className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <IoArrowBack className="text-lg" />
      </button>

      {/* Appointment Details */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl w-full">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Appointment Details</h2>
        <div className="text-gray-700 text-lg space-y-4">
          <p>
            <strong>Patient Name:</strong> <span className="font-semibold">{appointment.patientFullName}</span>
          </p>
          <p>
            <strong>Guardian Name:</strong> <span className="font-semibold">{appointment.guardianFullName}</span>
          </p>
          <p>
            <strong>Guardian Email:</strong> <span className="font-semibold">{appointment.guardianEmail}</span>
          </p>
          <p>
            <strong>Patient Age:</strong> <span className="font-semibold">{appointment.patientAge}</span>
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
      </div>
    </main>
  );
};

export default PediatricianViewAppointment;
