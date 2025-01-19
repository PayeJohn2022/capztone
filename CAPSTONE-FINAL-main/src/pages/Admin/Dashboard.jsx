import React, { useEffect, useState } from 'react';
import { CalendarIcon, UserGroupIcon, ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline'; // Heroicons for the new icons

const AdminDashboard = () => {
  const [appointmentsToday, setAppointmentsToday] = useState(0);
  const [consultationsToday, setConsultationsToday] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

        // Example: Fetch appointments for today (Replace this logic with actual API calls)
        const appointmentsData = await getAppointments();
        const appointmentsCount = appointmentsData.filter(
          (appointment) => appointment.date === today
        ).length;
        setAppointmentsToday(appointmentsCount);

        // Example: Fetch consultations for today
        const consultationsData = await getConsultations();
        const consultationsCount = consultationsData.filter(
          (consultation) => consultation.date === today
        ).length;
        setConsultationsToday(consultationsCount);

        // Example: Fetch total patients
        const patientsData = await getPatients();
        setTotalPatients(patientsData.length);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex-1 bg-gradient-to-br from-green-50 to-green-100 p-10 min-h-screen">
      {/* Welcome Message */}
      <h1 className="text-3xl font-extrabold mb-8 text-green-900 tracking-tight">
        Welcome to the Dashboard
      </h1>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Appointments Today */}
        <div className="bg-white p-10 rounded-xl shadow-lg border-l-4 border-green-500 flex flex-col items-center">
          <CalendarIcon className="h-16 w-16 text-green-600 mb-4" />
          <h2 className="text-6xl font-extrabold text-green-700">{appointmentsToday}</h2>
          <p className="text-xl text-gray-700 mt-4">Appointments Today</p>
        </div>

        {/* Consultations Today */}
        <div className="bg-white p-10 rounded-xl shadow-lg border-l-4 border-green-500 flex flex-col items-center">
          <ChatBubbleBottomCenterIcon className="h-16 w-16 text-green-600 mb-4" />
          <h2 className="text-6xl font-extrabold text-green-700">{consultationsToday}</h2>
          <p className="text-xl text-gray-700 mt-4">Consultations Today</p>
        </div>

        {/* Total Patients */}
        <div className="bg-white p-10 rounded-xl shadow-lg border-l-4 border-green-500 flex flex-col items-center">
          <UserGroupIcon className="h-16 w-16 text-green-600 mb-4" />
          <h2 className="text-6xl font-extrabold text-green-700">{totalPatients}</h2>
          <p className="text-xl text-gray-700 mt-4">Total Patients</p>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
