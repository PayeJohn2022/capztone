import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Lessa Mae',
    middleName: 'Caputol',
    lastName: 'Ebarle',
    email: 'ebarlelessa@email.com',
    contactNumber: '09157270949',
    clinicAddress: 'Ace Medical Center, Lapasan, Cagayan de Oro City',
    birthMonth: 'October',
    birthDay: '09',
    birthYear: '2003',
    gender: 'Female',
    nationality: 'Filipino',
  });
  const [profileImage, setProfileImage] = useState(null);

  const handleLogout = () => {
    navigate('/WelcomePage');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: 'Lessa Mae',
      middleName: 'Caputol',
      lastName: 'Ebarle',
      email: 'ebarlelessa@email.com',
      contactNumber: '09157270949',
      clinicAddress: 'Ace Medical Center, Lapasan, Cagayan de Oro City',
      birthMonth: 'October',
      birthDay: '09',
      birthYear: '2003',
      gender: 'Female',
      nationality: 'Filipino',
    });
  };

  return (
    <main className="flex-1 bg-green-100 p-10 h-screen">

      {/* Profile Form */}
      <div className="flex flex-col items-center p-10 bg-green-50 mb-10">
        <div className="flex flex-col items-center text-center mb-6">
          {/* Profile Image */}
          <img
            src={profileImage || 'path_to_default_profile_image'}
            alt="Profile"
            className="rounded-full w-32 h-32 object-cover border-2 border-green-600 mb-4"
          />
          {/* Edit Button */}
          <button
            onClick={toggleEditing}
            className={`mt-2 py-2 px-6 rounded ${isEditing ? 'bg-green-600' : 'bg-gray-400'} text-white hover:bg-green-700 transition duration-300`}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
          {/* File Input for Image */}
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 border border-gray-300 rounded p-2"
            />
          )}
        </div>

        <form className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block mb-1 font-semibold">Firstname:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border border-gray-300 rounded p-3 w-full"
                aria-label="First Name"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Middlename:</label>
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border border-gray-300 rounded p-3 w-full"
                aria-label="Middle Name"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Lastname:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border border-gray-300 rounded p-3 w-full"
                aria-label="Last Name"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-3 w-full"
              aria-label="Email"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">Contact Number:</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-3 w-full"
              aria-label="Contact Number"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">Address:</label>
            <input
              type="text"
              name="clinicAddress"
              value={formData.clinicAddress}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-3 w-full"
              aria-label="Clinic Address"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block mb-1 font-semibold">Month:</label>
              <input
                type="text"
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border border-gray-300 rounded p-3 w-full"
                aria-label="Birth Month"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Day:</label>
              <input
                type="text"
                name="birthDay"
                value={formData.birthDay}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border border-gray-300 rounded p-3 w-full"
                aria-label="Birth Day"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Year:</label>
              <input
                type="text"
                name="birthYear"
                value={formData.birthYear}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border border-gray-300 rounded p-3 w-full"
                aria-label="Birth Year"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">Gender:</label>
            <div className="flex space-x-4">
              <div>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mr-2"
                />
                <label className="mr-4">Male</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mr-2"
                />
                <label>Female</label>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-semibold">Nationality:</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-3 w-full"
              aria-label="Nationality"
            />
          </div>

          {/* Save and Cancel buttons below the Nationality input */}
          {isEditing && (
            <div className="flex space-x-4">
              <button
                onClick={handleCancel}
                className="bg-gray-400 text-white py-2 px-6 rounded hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={toggleEditing}
                className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-800 transition duration-300"
              >
                Save
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Activity Logs and About Us */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Activity Logs */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-600">
          <h3 className="font-semibold text-xl text-green-900">Activity Logs</h3>
          <p className="mt-2 text-gray-700">View your recent activities and actions.</p>
          <Link to="/pediatrician/activity-log">
            <button className="mt-4 bg-green-600 text-white py-2 px-6 rounded hover:bg-green-800 transition duration-300">
              Go to Activity Log
            </button>
          </Link>
        </div>

        {/* About Us */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-600">
          <h3 className="font-semibold text-xl text-green-900">About Us</h3>
          <p className="mt-2 text-gray-700">Learn more about KiddieCare.</p>
          <Link to="/pediatrician/about-us">
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
    </main>
  );
};

export default AdminProfile;
