import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MedicalRecords = () => {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patientName: "John Doe",
      date: "2024-12-09",
    },
    {
      id: 2,
      patientName: "Jane Smith",
      date: "2024-12-08",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("id"); // Default sort by PTR ID
  const [sortOrder, setSortOrder] = useState("asc"); // Ascending by default
  const navigate = useNavigate();

  // Filter and sort prescriptions
  const filteredPrescriptions = prescriptions
    .filter(
      (prescription) =>
        prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `PTR-${prescription.id}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      if (sortType === "id") {
        comparison = a.id - b.id;
      } else if (sortType === "patientName") {
        comparison = a.patientName.localeCompare(b.patientName);
      } else if (sortType === "date") {
        comparison = new Date(a.date) - new Date(b.date);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleView = (prescription) => {
    // Navigate to the View Prescription page with the selected prescription data
    navigate(`/pediatrician/view-prescription`, { state: { prescription } });
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Medical Records</h1>

      <div className="bg-white p-4 shadow rounded-lg mb-6">
        {/* Search and Sort Controls */}
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
          />

          <button
            onClick={toggleSortOrder}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300 hover:border-green-500 hover:bg-green-50"
          >
            {sortOrder === "asc" ? (
              <span className="text-green-500">↑</span>
            ) : (
              <span className="text-green-500">↓</span>
            )}
          </button>

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300 hover:border-green-500 hover:bg-green-50"
          >
            <option value="id">PTR ID</option>
            <option value="patientName">Patient Name</option>
            <option value="date">Date</option>
          </select>
        </div>

        {/* Prescriptions Table */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="p-3 text-left">PTR ID</th>
              <th className="p-3 text-left">Patient Name</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrescriptions.length > 0 ? (
              filteredPrescriptions.map((prescription) => (
                <tr key={prescription.id} className="border-t hover:bg-gray-100">
                  <td className="p-3">PTR-{prescription.id}</td>
                  <td className="p-3">{prescription.patientName}</td>
                  <td className="p-3">{prescription.date}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleView(prescription)}
                      className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-center text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicalRecords;
