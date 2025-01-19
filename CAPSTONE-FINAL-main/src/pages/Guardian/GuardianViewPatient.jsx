import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoArrowBack } from 'react-icons/io5';
import moment from 'moment';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const GuardianViewPatient = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [guardian, setGuardian] = useState(null);
  const [patients, setPatients] = useState([]);
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [editedPatientData, setEditedPatientData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuardianData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiBaseUrl}/api/patient/${email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Guardian:', guardian);  // Should log the guardian details
        console.log('Patients:', patients);  // Should log the list of patients


        console.log(response.data); 

        setGuardian(response.data.guardian);
        setPatients(response.data.patients);
        console.log('Guardian data:', response.data.guardian);
      console.log('Patients data:', response.data.patients);
      } catch (err) {
        console.error('Error fetching guardian data:', err);
        setError('Failed to fetch guardian details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchGuardianData();
  }, [email]);

  const handleEditPatient = (patientId) => {
    setEditingPatientId(patientId);
    const patient = patients.find((p) => p.id === patientId);
    setEditedPatientData(patient || {});
  };

  const handleCancelEdit = () => {
    setEditingPatientId(null);
    setEditedPatientData({});
  };

  const handleInputChange = (field, value) => {
    setEditedPatientData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSavePatient = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${apiBaseUrl}/api/patient/${patientId}`, editedPatientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update the patient data locally
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === patientId ? { ...patient, ...editedPatientData } : patient
        )
      );
      setEditingPatientId(null);
      alert('Patient details updated successfully!');
    } catch (err) {
      console.error('Error updating patient:', err);
      alert('Failed to update patient. Please try again.');
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return moment(date).format('YYYY-MM-DD');
  };

  if (loading) {
    return <p className="text-lg text-green-800">Loading guardian details...</p>;
  }

  if (error) {
    return <p className="text-lg text-red-500">{error}</p>;
  }

  return (
    <div className="p-10 bg-green-100 min-h-screen">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 w-10 h-10 mr-4"
        >
          <IoArrowBack className="text-lg" />
        </button>
        <h1 className="text-2xl font-bold">Guardian and Patient Details</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Guardian Details</h2>
        {guardian ? (
          <div className="mb-6">
            <p><strong>Name:</strong> {`${guardian.firstname} ${guardian.middlename || ''} ${guardian.lastname} ${guardian.extension || ''}`}</p>
            <p><strong>Email:</strong> {guardian.email}</p>
            <p><strong>Contact:</strong> {guardian.contact || 'No contact provided'}</p>
            <p><strong>Address:</strong> {guardian.guardianAddress}</p>
          </div>
        ) : (
          <p>No guardian details available.</p>
        )}

        <h2 className="text-2xl font-bold mb-4 mt-8">Patient Details</h2>
        {patients.length > 0 ? (
          patients.map((patient) => (
            <div key={patient.id} className="bg-gray-50 p-6 rounded-lg shadow-md mb-6">
              {editingPatientId === patient.id ? (
                <>
                  <input
                    type="text"
                    value={editedPatientData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Patient Name"
                    className="mb-2 p-2 border rounded w-full"
                  />
                  <input
                    type="number"
                    value={editedPatientData.age || ''}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Age"
                    className="mb-2 p-2 border rounded w-full"
                  />
                  <input
                    type="text"
                    value={editedPatientData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Address"
                    className="mb-2 p-2 border rounded w-full"
                  />
                  <input
                    type="date"
                    value={formatDate(editedPatientData.birthdate) || ''}
                    onChange={(e) => handleInputChange('birthdate', e.target.value)}
                    className="mb-2 p-2 border rounded w-full"
                  />
                  <select
                    value={editedPatientData.sex || ''}
                    onChange={(e) => handleInputChange('sex', e.target.value)}
                    className="mb-2 p-2 border rounded w-full"
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <input
                    type="text"
                    value={editedPatientData.birthplace || ''}
                    onChange={(e) => handleInputChange('birthplace', e.target.value)}
                    placeholder="Birthplace"
                    className="mb-2 p-2 border rounded w-full"
                  />
                  <input
                    type="text"
                    value={editedPatientData.religion || ''}
                    onChange={(e) => handleInputChange('religion', e.target.value)}
                    placeholder="Religion"
                    className="mb-2 p-2 border rounded w-full"
                  />
                  <input
                    type="text"
                    value={editedPatientData.fatherName || ''}
                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    placeholder="Father's Name"
                    className="mb-2 p-2 border rounded w-full"
                  />
                  <input
                    type="text"
                    value={editedPatientData.fatherAge || ''}
                    onChange={(e) => handleInputChange('fatherAge', e.target.value)}
                    placeholder="Father's Age"
                    className="mb-2 p-2 border rounded w-full"
                  />
                  <input
                    type="text"
                    value={editedPatientData.fatherOccupation || ''}
                    onChange={(e) => handleInputChange('fatherOccupation', e.target.value)}
                    placeholder="Father's Occupation"
                    className="mb-2 p-2 border rounded w-full"
                  />
                  <input
                    type="text"
                    value={editedPatientData.motherName || ''}
                    onChange={(e) => handleInputChange('motherName', e.target.value)}
                    placeholder="Mother's Name"
                    className="mb-2 p-2 border rounded w-full"
                  />
                  <input
                    type="text"
                    value={editedPatientData.motherAge || ''}
                    onChange={(e) => handleInputChange('motherAge', e.target.value)}
                    placeholder="Mother's Age"
                    className="mb-2 p-2 border rounded w-full"
                  />
                  <input
                    type="text"
                    value={editedPatientData.motherOccupation || ''}
                    onChange={(e) => handleInputChange('motherOccupation', e.target.value)}
                    placeholder="Mother's Occupation"
                    className="mb-2 p-2 border rounded w-full"
                  />
                  <input
                    type="text"
                    value={editedPatientData.cellphone || ''}
                    onChange={(e) => handleInputChange('cellphone', e.target.value)}
                    placeholder="Cellphone"
                    className="mb-2 p-2 border rounded w-full"
                  />
                  <input
                    type="text"
                    value={editedPatientData.informant || ''}
                    onChange={(e) => handleInputChange('informant', e.target.value)}
                    placeholder="Informant"
                    className="mb-2 p-2 border rounded w-full"
                  />
                  <input
                    type="text"
                    value={editedPatientData.relation || ''}
                    onChange={(e) => handleInputChange('relation', e.target.value)}
                    placeholder="Relation"
                    className="mb-2 p-2 border rounded w-full"
                  />
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleSavePatient(patient.id)}
                      className="bg-green-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Patient Name:</strong> {patient.name}</p>
                  <p><strong>Age:</strong> {patient.age}</p>
                  <p><strong>Address:</strong> {patient.address}</p>
                  <p><strong>Birth Date:</strong> {moment(patient.birthdate).format('YYYY-MM-DD')}</p>
                  <p><strong>Sex:</strong> {patient.sex}</p>
                  <p><strong>Birth Place:</strong> {patient.birthplace}</p>
                  <p><strong>Father's Name:</strong> {patient.fatherName}</p>
                  <p><strong>Father's Age:</strong> {patient.fatherAge}</p>
                  <p><strong>Father's Occupation:</strong> {patient.fatherOccupation}</p>
                  <p><strong>Mother's Name:</strong> {patient.motherName}</p>
                  <p><strong>Mother's Age:</strong> {patient.motherAge}</p>
                  <p><strong>Mother's Occupation:</strong> {patient.motherOccupation}</p>
                  <p><strong>Cellphone:</strong> {patient.cellphone}</p>
                  <p><strong>Informant:</strong> {patient.informant}</p>
                  <p><strong>Relation:</strong> {patient.relation}</p>

                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => handleEditPatient(patient.id)}
                      className="bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No patients associated with this guardian.</p>
        )}
      </div>
    </div>
  );
};

export default GuardianViewPatient;
