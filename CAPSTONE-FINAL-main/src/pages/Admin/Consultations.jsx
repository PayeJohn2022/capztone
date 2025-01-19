import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment'; // Import moment.js

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const AdminConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/consultations-get`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        // Filter out past consultations
        const filteredConsultations = response.data.consultations.filter(consultation => {
          const consultationDate = moment(consultation.date);
          return consultationDate.isSameOrAfter(moment(), 'day'); // Keep only present and future dates
        });

        setConsultations(filteredConsultations);
      } catch (error) {
        console.error('Error fetching consultations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const handleStatusChange = async (consultationId, status) => {
    try {
      await axios.put(
        `${apiBaseUrl}/api/consultations-admin`,
        { consultationId, status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );  
      setConsultations((prevConsultations) =>
        prevConsultations.map((consultation) =>
          consultation.consultationId === consultationId
            ? { ...consultation, status }
            : consultation
        )
      );
    } catch (error) {
      console.error('Error updating consultation status:', error);
    }
  };

  const handleSortOrderToggle = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const sortConsultations = (consultations) => {
    return consultations.sort((a, b) => {
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

  const filteredConsultations = sortConsultations(consultations).filter((consultation) => {
    const nameMatch = `${consultation.patientFullName} ${consultation.guardianFullName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter
      ? consultation.status.toLowerCase() === statusFilter.toLowerCase()
      : true;
    return nameMatch && statusMatch;
  });

  if (loading) {
    return <div className="text-center text-lg">Loading consultations...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Consultations Dashboard</h2>
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
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredConsultations.map((consultation) => (
              <tr key={consultation.consultationId} className="border-b hover:bg-green-50">
                <td className="px-6 py-4">{consultation.patientFullName}</td>
                <td className="px-6 py-4">{consultation.guardianFullName}</td>
                <td className="px-6 py-4">
                  {moment(consultation.date).format('MMMM Do YYYY')} {/* Format the date */}
                </td>
                <td className="px-6 py-4">
                  {moment(consultation.timeStart, 'HH:mm').format('hh:mm A')} - {moment(consultation.timeEnd, 'HH:mm').format('hh:mm A')}
                </td>
                <td className="px-6 py-4">
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
                </td>
                <td className="px-6 py-4">
                  {consultation.status.toLowerCase() === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(consultation.consultationId, 'approved')}
                        className="bg-green-600 text-white py-1 px-4 rounded-md hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(consultation.consultationId, 'declined')}
                        className="bg-red-600 text-white py-1 px-4 rounded-md hover:bg-red-700"
                      >
                        Decline
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminConsultations;
