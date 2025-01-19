import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment'; // For date and time formatting

const AdminActivityLogs = () => {
  const [appointments, setAppointments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, consultationsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/appointments-get', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:5000/api/consultations-get', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);

        setAppointments(appointmentsRes.data.appointments);
        setConsultations(consultationsRes.data.consultations);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSortOrderToggle = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'time') {
        comparison = new Date(`1970-01-01T${a.timeStart}`) - new Date(`1970-01-01T${b.timeStart}`);
      } else if (sortBy === 'patient') {
        comparison = a.patientFullName.localeCompare(b.patientFullName);
      } else if (sortBy === 'guardian') {
        comparison = a.guardianFullName.localeCompare(b.guardianFullName);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  };

  const filterData = (data) => {
    return sortData(data).filter((item) => {
      const nameMatch = `${item.patientFullName} ${item.guardianFullName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter
        ? item.status.toLowerCase() === statusFilter.toLowerCase()
        : true;
      return nameMatch && statusMatch;
    });
  };

  if (loading) {
    return <div className="text-center text-lg">Loading activity logs...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Activity Logs</h2>

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
          {sortOrder === 'asc' ? '↑' : '↓'}
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
          <option value="approved">Approved</option>
          <option value="declined">Declined</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto text-left text-sm text-gray-500">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">Patient</th>
              <th className="px-6 py-3">Guardian</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filterData([...appointments, ...consultations]).map((item, index) => (
              <tr key={index} className="border-b hover:bg-green-50">
                <td className="px-6 py-4">{item.patientFullName}</td>
                <td className="px-6 py-4">{item.guardianFullName}</td>
                <td className="px-6 py-4">{moment(item.date).format('MMMM D, YYYY')}</td>
                <td className="px-6 py-4">
                  {moment(item.timeStart, 'HH:mm').format('hh:mm A')} - {moment(item.timeEnd, 'HH:mm').format('hh:mm A')}
                </td>
                <td className="px-6 py-4">
                  {appointments.includes(item) ? 'Appointment' : 'Consultation'}
                </td>
                <td className="px-6 py-4">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminActivityLogs;
