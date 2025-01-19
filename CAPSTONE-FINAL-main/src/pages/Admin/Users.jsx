import React, { useState } from "react";

const AdminUsers = () => {
  // Mock data for demonstration
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "johndoe@example.com", role: "Guardian", status: "Pending" },
    { id: 2, name: "Jane Smith", email: "janesmith@example.com", role: "Pediatrician", status: "Pending" },
    { id: 3, name: "Alice Johnson", email: "alicejohnson@example.com", role: "Guardian", status: "Pending" },
  ]);

  // Function to handle Accept action
  const handleAccept = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: "Accepted" } : user
      )
    );
  };

  // Function to handle Decline action
  const handleDecline = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, status: "Declined" } : user
      )
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Users Management</h1>

      <table className="w-full bg-white rounded-lg shadow-md">
        <thead className="bg-green-700 text-white">
          <tr>
            <th className="p-4 text-left">#</th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              className={`${
                index % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
              } hover:bg-gray-200 transition-all`}
            >
              <td className="p-4">{index + 1}</td>
              <td className="p-4">{user.name}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">{user.role}</td>
              <td className={`p-4 font-semibold ${getStatusColor(user.status)}`}>
                {user.status}
              </td>
              <td className="p-4 text-center">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-600"
                  onClick={() => handleAccept(user.id)}
                  disabled={user.status !== "Pending"}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  onClick={() => handleDecline(user.id)}
                  disabled={user.status !== "Pending"}
                >
                  Decline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper function to assign status colors
const getStatusColor = (status) => {
  switch (status) {
    case "Accepted":
      return "text-green-600";
    case "Declined":
      return "text-red-600";
    default:
      return "text-gray-700";
  }
};

export default AdminUsers;
