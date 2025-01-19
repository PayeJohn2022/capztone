import React, { useState } from 'react';
import profileImage from '../../assets/kiddie.png';

const Settings = () => {
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

  const [profileImage, setProfileImage] = useState(null); // State for profile image

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Set the image preview
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex flex-col items-center p-10 bg-green-50 min-h-screen">
      <div className="text-center mb-6">
        <img
          src={profileImage || 'path_to_default_profile_image'} // Use a default image if none is selected
          alt="Profile"
          className="rounded-full w-24 h-24 object-cover border-2 border-green-600"
        />
        <button
          onClick={toggleEditing}
          className={`mt-2 py-2 px-4 rounded ${isEditing ? 'bg-green-600' : 'bg-gray-400'} text-white hover:bg-green-700 transition duration-300`}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 border border-gray-300 rounded p-2"
          />
        )}
      </div>

      <form className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-semibold">Firstname:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-2 w-full"
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
              className="border border-gray-300 rounded p-2 w-full"
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
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Contact Number:</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Clinic Address:</label>
          <input
            type="text"
            name="clinicAddress"
            value={formData.clinicAddress}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-1 font-semibold">Month:</label>
            <input
              type="text"
              name="birthMonth"
              value={formData.birthMonth}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-2 w-full"
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
              className="border border-gray-300 rounded p-2 w-full"
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
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Gender:</label>
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

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Nationality:</label>
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>
      </form>
    </div>
  );
};

export default Settings;
