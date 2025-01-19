import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const GuardianPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');

        if (!email) {
          throw new Error('Guardian email is missing');
        }

        const response = await axios.get(`${apiBaseUrl}/api/patient/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPatients(response.data.patients);
      } catch (err) {
        console.error('Failed to fetch patients:', err);
        setError('Failed to fetch patients. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setDropdownVisible(false);
  };

  const getFilteredAndSortedPatients = () => {
    let filtered = patients.filter((patient) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (patient.name && patient.name.toLowerCase().includes(searchLower)) ||
        (patient.email && patient.email.toLowerCase().includes(searchLower)) ||
        (patient.guardian && patient.guardian.toLowerCase().includes(searchLower)) ||
        (patient.address && patient.address.toLowerCase().includes(searchLower))
      );
    });

    if (sortOption === 'name') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'age') {
      filtered = filtered.sort((a, b) => a.age - b.age);
    }

    return filtered;
  };

  const filteredPatients = getFilteredAndSortedPatients();

  return (
    <main className="flex-1 bg-green-100 p-10 h-screen">
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center space-x-4 flex-1">
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-green-500"
        />
  
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none"
          >
            Filter/Sort
          </button>
          {dropdownVisible && (
            <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg border border-gray-200 z-10">
              <button
                onClick={() => handleSortChange('name')}
                className="block px-4 py-2 text-left hover:bg-green-100 w-full"
              >
                Sort by Name
              </button>
              <button
                onClick={() => handleSortChange('age')}
                className="block px-4 py-2 text-left hover:bg-green-100 w-full"
              >
                Sort by Age
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  
    <div className="bg-white p-5 rounded-lg shadow-lg">
      {loading ? (
        <p className="text-lg text-green-800">Loading patients...</p>
      ) : error ? (
        <p className="text-lg text-red-500">{error}</p>
      ) : filteredPatients.length > 0 ? (
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="py-3 px-4 text-left">Patient ID</th>
              <th className="py-3 px-4 text-left">Patient Name</th>
              <th className="py-3 px-4 text-left">Age</th>
              <th className="py-3 px-4 text-left">Guardian/Parent</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="border-b hover:bg-green-50">
                <td className="py-2 px-4">{patient.id}</td>
                <td className="py-2 px-4">{patient.name}</td>
                <td className="py-2 px-4">{patient.age}</td>
                <td className="py-2 px-4">{patient.guardian}</td>
                <td className="py-2 px-4">{patient.email}</td>
                <td className="py-2 px-4">{patient.address}</td>
                <td className="py-2 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/guardian/${patient.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-lg text-green-800">No patients found.</p>
      )}
    </div>
  
    {/* Centered Add Patient Button */}
    <div className="flex justify-center mt-6">
      <button
        onClick={() => navigate('/guardian/register-patient')}
        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 focus:outline-none"
      >
        Add Patient
      </button>
    </div>
  </main>  
  );
};

export default GuardianPatients;