import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns'; // Importing date-fns for better date formatting

const GuardianActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('/api/activity-log/'); // Replace with your API endpoint
        console.log('API Response:', response.data); // Log the response data
        if (Array.isArray(response.data)) {
          setActivities(response.data);
        } else {
          console.error('Expected an array but received:', response.data);
          setActivities([]); // Reset to empty if not an array
        }
      } catch (error) {
        console.error('Failed to fetch activities:', error);
        setError('Error fetching activities. Please try again later.');
        setActivities([]); // Reset to empty on error
      } finally {
        setLoading(false); // Stop loading once request is completed
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-green-700 text-xl">Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Activity Log</h2>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {error && (
          <div className="p-4 text-red-700 bg-red-100 rounded-t-lg">
            <strong>Error: </strong>{error}
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {activities.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-900">No activities available.</td>
              </tr>
            ) : (
              activities.map((activity, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{format(new Date(activity.date), 'PPPpp')}</td>
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

export default GuardianActivityLog;
