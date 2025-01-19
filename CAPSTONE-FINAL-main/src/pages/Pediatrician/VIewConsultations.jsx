import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const PediatricianViewConsultation = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultationDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/get-consultation-details-for-pediatrician/${consultationId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
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

  if (loading) {
    return <div className="text-center text-lg text-green-800">Loading consultation details...</div>;
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

      {/* Consultation Details */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl w-full">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Consultation Details</h2>
        <div className="text-gray-700 text-lg space-y-4">
          <p>
            <strong>Patient Name:</strong> <span className="font-semibold">{consultation.patientFullName}</span>
          </p>
          <p>
            <strong>Guardian Name:</strong> <span className="font-semibold">{consultation.guardianFullName}</span>
          </p>
          <p>
            <strong>Guardian Email:</strong> <span className="font-semibold">{consultation.guardianEmail}</span>
          </p>
          <p>
            <strong>Patient Age:</strong> <span className="font-semibold">{consultation.patientAge}</span>
          </p>
          <p>
            <strong>Consultation Date:</strong>{' '}
            <span className="font-semibold">{new Date(consultation.date).toLocaleDateString()}</span>
          </p>
          <p>
            <strong>Consultation Time:</strong>{' '}
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
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                consultation.status.toLowerCase() === 'pending'
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
      </div>
    </main>
  );
};

export default PediatricianViewConsultation;
