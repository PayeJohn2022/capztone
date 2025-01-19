import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPatient = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch patient data (Replace this with an actual API call)
    const fetchPatients = async () => {
      try {
        const response = [
          {
            id: 1,
            firstName: "John",
            middleName: "A.",
            lastName: "Doe",
            sex: "Male",
            birthdate: "1990-05-15",
          },
          {
            id: 2,
            firstName: "Jane",
            middleName: "B.",
            lastName: "Smith",
            sex: "Female",
            birthdate: "1995-11-20",
          },
        ];
        setPatients(response);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const handleView = (id) => {
    navigate(`/patients/view/${id}`); // Redirect to patient view page
  };

  const handleEdit = (id) => {
    navigate(`/patients/edit/${id}`); // Redirect to patient edit page
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Patients</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4">Patient ID</th>
              <th className="py-3 px-4">First Name</th>
              <th className="py-3 px-4">Middle Name</th>
              <th className="py-3 px-4">Last Name</th>
              <th className="py-3 px-4">Sex</th>
              <th className="py-3 px-4">Birthdate</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <tr key={patient.id} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-4">{patient.id}</td>
                  <td className="py-3 px-4">{patient.firstName}</td>
                  <td className="py-3 px-4">{patient.middleName}</td>
                  <td className="py-3 px-4">{patient.lastName}</td>
                  <td className="py-3 px-4">{patient.sex}</td>
                  <td className="py-3 px-4">{patient.birthdate}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      onClick={() => handleView(patient.id)}
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(patient.id)}
                      className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPatient;
