import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { ArrowLeftIcon } from '@heroicons/react/24/solid'; // Import back icon from Heroicons

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('/api/activity-log/'); // Replace with your API endpoint
        console.log('API Response:', response.data); // Log the response data
        if (Array.isArray(response.data)) {
          setActivities(response.data);
        } else {
          console.error('Expected an array but received:', response.data);
          setActivities([]); // Reset to an empty array if not an array
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
        alert('Error fetching activities.'); // Alert user of the issue
        setActivities([]); // Reset to empty on error
      }
    };

    fetchActivities();
  }, []);

  // Handle search filtering
  const filteredActivities = activities.filter(activity => 
    activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle sorting
  const handleSort = () => {
    const sortedActivities = [...filteredActivities].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setActivities(sortedActivities);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Back Icon Button */}
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="flex items-center text-green-700 hover:text-blue-800 mb-4"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" /> {/* Back arrow icon */}
        Back to Profile
      </button>


      {/* Search Bar */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg flex-grow"
        />
        <button
          onClick={handleSort}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700"
        >
          Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredActivities.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-900">No activities available.</td>
              </tr>
            ) : (
              filteredActivities.map((activity, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(activity.date).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.user}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLog;
