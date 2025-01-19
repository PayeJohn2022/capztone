import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const GuardianViewConsultation = () => {
  const { consultationId } = useParams(); // Get appointment ID from route params
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Consultation ID:', consultationId);
    const fetchConsultationDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiBaseUrl}/api/get-consultation-details/${consultationId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setConsultation(response.data);
      } catch (err) {
        console.error('Error fetching consultation details:', err);
        setError('Failed to fetch consultation details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultationDetails();
  }, [consultationId]);

  const handleBack = () => navigate(-1); // Navigate back
  const handleEdit = () => console.log('Edit consultation:', consultationId); // Placeholder for edit functionality
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this consultation?')) {
      try {
        await axios.delete(`${apiBaseUrl}/api/consultations/${consultationId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        alert('Consultation deleted successfully.');
        navigate('/guardian/consultations'); // Navigate to the appointments list
      } catch (err) {
        console.error('Error deleting consultation:', err);
        alert('Failed to delete consultation. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="text-center text-lg text-green-800">Loading consultation details...</div>;
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
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Consultation Details</h2>
        <div className="text-gray-700 text-lg space-y-4">
          <p>
            <strong>Type:</strong> <span className="font-semibold">Consultation</span>
          </p>
          <p>
            <strong>Guardian Name:</strong> <span className="font-semibold">{consultation.guardianFullName}</span>
          </p>
          <p>
            <strong>Email:</strong> <span className="font-semibold">{consultation.guardianEmail}</span>
          </p>
          <p>
            <strong>Patient Name:</strong> <span className="font-semibold">{consultation.patientFullName}</span>
          </p>
          <p>
            <strong>Age:</strong> <span className="font-semibold">{consultation.patientAge}</span>
          </p>
          <p>
            <strong>Schedule Date:</strong>{' '}
            <span className="font-semibold">{new Date(consultation.date).toLocaleDateString()}</span>
          </p>
          <p>
            <strong>Schedule Time:</strong>{' '}
            <span className="font-semibold">
              {consultation.timeStart} - {consultation.timeEnd}
            </span>
          </p>
          <p>
            <strong>Description:</strong> <span className="font-semibold">{consultation.description}</span>
          </p>
          <p>
            <strong>Status:</strong>{' '}
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${consultation.status.toLowerCase() === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : consultation.status.toLowerCase() === 'approved'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                }`}
            >
              {consultation.status}
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          {/* Edit Button */}
          <button
            onClick={() => navigate(`/guardian/edit-consultations`)}
            // onClick={() => navigate(`/guardian/edit-appointment/${appointmentId}`)}
            className="w-24 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Edit
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="w-24 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </main>
  );
};

export default GuardianViewConsultation;
