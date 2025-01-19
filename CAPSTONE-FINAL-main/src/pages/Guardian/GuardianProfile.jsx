import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const GuardianProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    contact: '',
    guardianAddress: '',
  });
  const [profileImage, setProfileImage] = useState('');
  const [originalProfileImage, setOriginalProfileImage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch guardian data
  const fetchGuardianData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiBaseUrl}/api/guardian-get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const guardianData = response.data;
      setFormData({
        firstName: guardianData.firstname,
        middleName: guardianData.middlename,
        lastName: guardianData.lastname,
        contact: guardianData.contact,
        guardianAddress: guardianData.guardianAddress,
      });

      if (guardianData.profileImage) {
        setProfileImage(`${apiBaseUrl}${guardianData.profileImage}`);
        setOriginalProfileImage(`${apiBaseUrl}${guardianData.profileImage}`);
      }
    } catch (err) {
      console.error('Error fetching guardian data:', err);
      setError('Failed to load guardian data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuardianData();
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
    fetchGuardianData();
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token or any stored user data
    window.location.href = '/login'; // Redirect the user to the login page
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
      updatedFormData.append('guardianAddress', formData.guardianAddress);
  
      if (profileImage && profileImage !== originalProfileImage) {
        updatedFormData.append('profileImage', profileImage);
      }
  
      const response = await axios.put(
        `${apiBaseUrl}/api/guardian-update-profile`,
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
        guardianAddress: updatedProfile.guardianAddress,
      });
      setProfileImage(`${apiBaseUrl}${updatedProfile.profileImage}`);
      setOriginalProfileImage(`${apiBaseUrl}${updatedProfile.profileImage}`);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving guardian data:', err);
      alert('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
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
              name="guardianAddress"
              value={formData.guardianAddress}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full border p-2 rounded-lg ${isEditing ? 'bg-gray-50' : 'bg-transparent'}`}
            />
          </div>
           {/* About Us */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-600">
          <h3 className="font-semibold text-xl text-green-900">About Us</h3>
          <p className="mt-2 text-gray-700">Learn more about KiddieCare.</p>
          <Link to="/guardian/about-us">
            <button className="mt-4 bg-green-600 text-white py-2 px-6 rounded hover:bg-green-800 transition duration-300">
              Go to About Us
            </button>
          </Link>
        </div>
      </div>

      {/* Logout */}
      <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-600">
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

export default GuardianProfile;
