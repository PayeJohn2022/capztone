import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment'; // Import moment.js for date and time formatting

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // Default to sorting by date
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending, 'desc' for descending
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/appointments-get`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        
        // Filter out past appointments
        const filteredAppointments = response.data.appointments.filter((appointment) => {
          const appointmentDate = moment(appointment.date);
          return appointmentDate.isSameOrAfter(moment(), 'day'); // Only keep present and future appointments
        });

        setAppointments(filteredAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointmentId, status) => {
    try {
      await axios.put(`${apiBaseUrl}/api/appointments-admin`, 
        { appointmentId, status }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.appointmentId === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const handleSortOrderToggle = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const sortAppointments = (appointments) => {
    return appointments.sort((a, b) => {
      let comparison = 0;
  
      if (sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'time') {
        comparison = new Date(`1970-01-01T${a.timeStart}`) - new Date(`1970-01-01T${b.timeStart}`);
      } else if (sortBy === 'patient') {
        const patientA = a.patientFullName ? a.patientFullName : '';
        const patientB = b.patientFullName ? b.patientFullName : '';
        comparison = patientA.localeCompare(patientB);
      } else if (sortBy === 'guardian') {
        const guardianA = a.guardianFullName ? a.guardianFullName : '';
        const guardianB = b.guardianFullName ? b.guardianFullName : '';
        comparison = guardianA.localeCompare(guardianB);
      }
  
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const filteredAppointments = sortAppointments(appointments)
    .filter((appointment) => {
      const nameMatch = `${appointment.patientFullName} ${appointment.guardianFullName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter
        ? appointment.status.toLowerCase() === statusFilter.toLowerCase()
        : true;
      const statusSearchMatch = searchTerm
        ? appointment.status.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return (nameMatch || statusSearchMatch) && statusMatch;
    });

  if (loading) {
    return <div className="text-center text-lg">Loading appointments...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Admin Appointment Dashboard</h2>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
        />
        <button
          onClick={handleSortOrderToggle}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring focus:ring-green-300 hover:border-green-500 hover:bg-green-50"
        >
          {sortOrder === 'asc' ? (
            <span className="text-green-500">↑</span>
          ) : (
            <span className="text-green-500">↓</span>
          )}
        </button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300 hover:border-green-500 hover:bg-green-50"
        >
          <option value="date">Date</option>
          <option value="time">Time</option>
          <option value="patient">Patient</option>
          <option value="guardian">Guardian</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300 hover:border-green-500 hover:bg-green-50"
        >
          <option value="">Filter by Status</option>
          <option value="approved" className="hover:bg-green-50">Approved</option>
          <option value="declined" className="hover:bg-green-50">Declined</option>
          <option value="pending" className="hover:bg-green-50">Pending</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto text-left text-sm text-gray-500">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">Guardian</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.appointmentId} className="border-b hover:bg-green-50">
                <td className="px-6 py-4">{appointment.patientFullName}</td>
                <td className="px-6 py-4">{appointment.guardianFullName}</td>
                <td className="px-6 py-4">
                  {moment(appointment.date).format('MMMM D, YYYY')}
                </td>
                <td className="px-6 py-4">
                  {moment(appointment.timeStart, 'HH:mm').format('hh:mm A')} - 
                  {moment(appointment.timeEnd, 'HH:mm').format('hh:mm A')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    appointment.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    appointment.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  {appointment.status.toLowerCase() === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(appointment.appointmentId, 'approved')}
                        className="bg-green-600 text-white py-1 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusChange(appointment.appointmentId, 'declined')}
                        className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {appointment.status.toLowerCase() === 'approved' && <span className="text-green-600 font-semibold">Approved</span>}
                  {appointment.status.toLowerCase() === 'declined' && <span className="text-red-600 font-semibold">Declined</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAppointments;
