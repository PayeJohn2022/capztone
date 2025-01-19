import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { CalendarIcon, PhoneIcon, PencilIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const GuardianDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [showAppointments, setShowAppointments] = useState(true);
  const [showConsultations, setShowConsultations] = useState(true);
  const navigate = useNavigate();

  // const consultations = [{ if possible, add the file or link of prescription from the pedia's prescription

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found, redirecting to login');
          navigate('/login');
          return;
        }

        console.log('Token:', token);

        const today = new Date();

        const appointmentsResponse = await axios.get(`${apiBaseUrl}/api/get-upcoming-appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const appointmentsData = appointmentsResponse.data;
        if (Array.isArray(appointmentsData)) {
          const filteredAppointments = appointmentsData.filter((appointment) => {
            const appointmentDate = new Date(appointment.date);
            return appointmentDate >= today;
          });

          setAppointments(
            filteredAppointments.map((appointment) => ({
              ...appointment,
              date: new Date(appointment.date).toLocaleDateString(),
              time: `${appointment.timeStart} - ${appointment.timeEnd}`,
            }))
          );
        }

        const consultationsResponse = await axios.get(`${apiBaseUrl}/api/get-upcoming-consultations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const consultationsData = consultationsResponse.data;
        if (Array.isArray(consultationsData)) {
          const filteredConsultations = consultationsData.filter((consultation) => {
            const consultationDate = new Date(consultation.date);
            return consultationDate >= today;
          });

          setConsultations(
            filteredConsultations.map((consultation) => ({
              ...consultation,
              date: new Date(consultation.date).toLocaleDateString(),
              time: `${consultation.timeStart} - ${consultation.timeEnd}`,
            }))
          );
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <main className="flex-1 bg-gradient-to-br from-green-50 to-green-100 p-10 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-green-900 tracking-tight">
        Welcome to the Dashboard
      </h1>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <button
          onClick={() => navigate('/guardian/calendar')}
          className="bg-white w-full h-64 flex flex-col items-center justify-center p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:bg-green-50 transition-all hover:scale-105"
        >
          <CalendarIcon className="h-16 w-16 text-green-600 mb-4" />
          <h3 className="font-bold text-xl text-green-800 tracking-wide">View Calendar</h3>
        </button>

        <button
          onClick={() => navigate('/guardian/request-consultation')}
          className="bg-white w-full h-64 flex flex-col items-center justify-center p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:bg-green-50 transition-all hover:scale-105"
        >
          <PhoneIcon className="h-16 w-16 text-green-600 mb-4" />
          <h3 className="font-bold text-xl text-green-800 tracking-wide">Request Consultation</h3>
        </button>

        <button
          onClick={() => navigate('/guardian/request-appointment')}
          className="bg-white w-full h-64 flex flex-col items-center justify-center p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:bg-green-50 transition-all hover:scale-105"
        >
          <PencilIcon className="h-16 w-16 text-green-600 mb-4" />
          <h3 className="font-bold text-xl text-green-800 tracking-wide">Request Appointment</h3>
        </button>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 mb-8">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowAppointments(!showAppointments)}
        >
          <h2 className="text-2xl font-bold text-green-700 mb-6 border-b-2 border-green-400 pb-2">
            Upcoming Appointments
          </h2>
          <span className="text-green-700 text-xl">
            {showAppointments ? <FaCaretUp /> : <FaCaretDown />}
          </span>
        </div>
        {showAppointments && (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {appointments.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {appointments.map((appointment) => (
                  <li
                    key={appointment.appointmentId}
                    className="p-5 bg-gray-50 shadow-md rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-medium text-green-900">
                          {appointment.patientFullName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          <strong>Date:</strong> {appointment.date}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Time:</strong> {appointment.time}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Status:</strong> {appointment.status}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          navigate(`/guardian/get-appointments/${appointment.appointmentId}`)
                        }
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-700 font-light">
                No upcoming appointments scheduled yet.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Upcoming Consultations */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowConsultations(!showConsultations)}
        >
          <h2 className="text-2xl font-bold text-green-700 mb-6 border-b-2 border-green-400 pb-2">
            Upcoming Consultations
          </h2>
          <span className="text-green-700 text-xl">
            {showConsultations ? <FaCaretUp /> : <FaCaretDown />}
          </span>
        </div>
        {showConsultations && (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {consultations.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {consultations.map((consultation) => (
                  <li
                    key={consultation.consultationId}
                    className="p-5 bg-gray-50 shadow-md rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-medium text-green-900">
                          {consultation.patientFullName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          <strong>Date:</strong> {consultation.date}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Time:</strong> {consultation.time}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Status:</strong> {consultation.status}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          navigate(`/guardian/get-consultation-details/${consultation.consultationId}`)
                        }
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-700 font-light">
                No upcoming consultations scheduled yet.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default GuardianDashboard;
