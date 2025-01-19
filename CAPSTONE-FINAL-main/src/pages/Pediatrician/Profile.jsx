import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    contact: '',
    clinicAddress: '',
    specialization: '', // Add specialization to the state
  });
  const [profileImage, setProfileImage] = useState('');
  const [originalProfileImage, setOriginalProfileImage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook for navigation

  // Fetch pediatrician data
  const fetchPediatricianData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiBaseUrl}/api/pediatrician-get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const pediatricianData = response.data;
      setFormData({
        firstName: pediatricianData.firstname,
        middleName: pediatricianData.middlename,
        lastName: pediatricianData.lastname,
        contact: pediatricianData.contact,
        clinicAddress: pediatricianData.clinicAddress,
        specialization: pediatricianData.specialization || '', // Handle specialization
      });

      if (pediatricianData.profileImage) {
        setProfileImage(`${apiBaseUrl}${pediatricianData.profileImage}`);
        setOriginalProfileImage(`${apiBaseUrl}${pediatricianData.profileImage}`);
      }
    } catch (err) {
      console.error('Error fetching pediatrician data:', err);
      setError('Failed to load pediatrician data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPediatricianData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toggleEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setProfileImage(originalProfileImage);
    fetchPediatricianData();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        alert('File size exceeds 50MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
      }
      setProfileImage(file); // Set the file object directly
    }
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const updatedFormData = new FormData();

      updatedFormData.append('firstName', formData.firstName);
      updatedFormData.append('middleName', formData.middleName);
      updatedFormData.append('lastName', formData.lastName);
      updatedFormData.append('contact', formData.contact);
      updatedFormData.append('clinicAddress', formData.clinicAddress);
      updatedFormData.append('specialization', formData.specialization); // Add specialization to the form data

      if (profileImage && profileImage !== originalProfileImage) {
        updatedFormData.append('profileImage', profileImage);
      }

      const response = await axios.put(
        `${apiBaseUrl}/api/pediatrician-update-profile`,
        updatedFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Profile updated successfully!');
      const updatedProfile = response.data.updatedProfile;

      // Update local state with the updated profile data
      setFormData({
        firstName: updatedProfile.firstname,
        middleName: updatedProfile.middlename,
        lastName: updatedProfile.lastname,
        contact: updatedProfile.contact,
        clinicAddress: updatedProfile.clinicAddress,
        specialization: updatedProfile.specialization, // Handle specialization update
      });
      setProfileImage(`${apiBaseUrl}${updatedProfile.profileImage}`);
      setOriginalProfileImage(`${apiBaseUrl}${updatedProfile.profileImage}`);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving pediatrician data:', err);
      alert('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center p-10 bg-gray-50 min-h-screen">
      <div className="text-center mb-6">
        <img
          src={typeof profileImage === 'string' ? profileImage : 'path_to_default_profile_image'}
          alt="Profile"
          className="rounded-full w-32 h-32 object-cover border-2 border-green-600"
        />
        {isEditing ? (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 border border-gray-300 rounded p-2"
            />
            <button
              onClick={saveChanges}
              disabled={isSaving}
              className="mt-4 py-2 px-6 rounded-full bg-green-600 text-white hover:bg-opacity-90 transition duration-300"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={cancelEditing}
              className="mt-4 ml-2 py-2 px-6 rounded-full bg-red-500 text-white hover:bg-opacity-90 transition duration-300"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={toggleEditing}
            className="mt-4 py-2 px-6 rounded-full bg-blue-500 text-white hover:bg-opacity-90 transition duration-300"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-600 font-semibold">First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full border p-2 rounded-lg ${isEditing ? 'bg-gray-50' : 'bg-transparent'}`}
            />
          </div>
          <div>
            <label className="block text-gray-600 font-semibold">Middle Name:</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full border p-2 rounded-lg ${isEditing ? 'bg-gray-50' : 'bg-transparent'}`}
            />
          </div>
          <div>
            <label className="block text-gray-600 font-semibold">Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full border p-2 rounded-lg ${isEditing ? 'bg-gray-50' : 'bg-transparent'}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-600 font-semibold">Contact:</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full border p-2 rounded-lg ${isEditing ? 'bg-gray-50' : 'bg-transparent'}`}
            />
          </div>
          <div>
            <label className="block text-gray-600 font-semibold">Address:</label>
            <input
              type="text"
              name="clinicAddress"
              value={formData.clinicAddress}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full border p-2 rounded-lg ${isEditing ? 'bg-gray-50' : 'bg-transparent'}`}
            />
          </div>
          <div>
            <label className="block text-gray-600 font-semibold">Specialization:</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full border p-2 rounded-lg ${isEditing ? 'bg-gray-50' : 'bg-transparent'}`}
            />
          </div>
        </div>

        {/* About Us Section */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-600">
          <h3 className="font-semibold text-xl text-green-900">About Us</h3>
          <p className="mt-2 text-gray-700">Learn more about KiddieCare.</p>
          <Link to="/guardian/about-us">
            <button className="mt-4 bg-green-600 text-white py-2 px-6 rounded hover:bg-green-800 transition duration-300">
              Go to About Us
            </button>
          </Link>
        </div>

        {/* Logout */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-600 mt-6">
          <h3 className="font-semibold text-xl text-green-900">Logout</h3>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-600 text-white py-2 px-6 rounded hover:bg-red-800 transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
