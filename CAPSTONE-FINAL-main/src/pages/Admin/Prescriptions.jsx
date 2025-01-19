import React, { useState } from 'react';

const AdminPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: "John Doe",
      date: "2024-12-09",
      medication: "Paracetamol",
      dosage: "500mg, twice daily",
      status: "Pending",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      date: "2024-12-08",
      medication: "Ibuprofen",
      dosage: "200mg, three times daily",
      status: "Pending",
    },
  ]);

  const handleSend = (id) => {
    const updatedPrescriptions = prescriptions.map((prescription) =>
      prescription.id === id ? { ...prescription, status: "Sent" } : prescription
    );
    setPrescriptions(updatedPrescriptions);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Prescriptions</h1>
      <div className="bg-white p-4 shadow rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="p-3 text-left">Patient Name</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Medication</th>
              <th className="p-3 text-left">Dosage</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription) => (
              <tr key={prescription.id} className="border-t hover:bg-gray-100">
                <td className="p-3">{prescription.patientName}</td>
                <td className="p-3">{prescription.date}</td>
                <td className="p-3">{prescription.medication}</td>
                <td className="p-3">{prescription.dosage}</td>
                <td className="p-3 text-green-700 font-semibold">
                  {prescription.status}
                </td>
                <td className="p-3 text-center">
                  {prescription.status === "Pending" ? (
                    <button
                      onClick={() => handleSend(prescription.id)}
                      className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 transition"
                    >
                      Send
                    </button>
                  ) : (
                    <span className="text-gray-500 italic">Sent</span>
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

export default AdminPrescriptions;
