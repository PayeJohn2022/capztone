import React, { useState } from 'react';
import Calendar from "react-calendar";
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import moment from "moment-timezone";

const PediatricianDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [showAppointments, setShowAppointments] = useState(true);
  const [showConsultations, setShowConsultations] = useState(true);
  
  // Sample data for demonstration
  const appointments = [{
    appointmentId: 1,
    patientFullName: "John Doe",
    date: "2025-01-20",
    timeStart: "09:00:00",
    timeEnd: "10:00:00",
    status: "approved"
  }];

  const consultations = [{
    consultationId: 1,
    patientFullName: "Jane Smith",
    date: "2025-01-20",
    timeStart: "14:00:00",
    timeEnd: "15:00:00",
    status: "approved"
  }];

  const closeModal = () => {
    setSelectedDate(null);
    setModalData(null);
  };

  return (
    <main className="flex-1 bg-gradient-to-br from-green-50 to-green-100 p-10 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-green-900 tracking-tight">
        Welcome to the Dashboard
      </h1>

      {/* Calendar Section - Updated with Add Availability button */}
      <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-600 mb-8">
        <div className="flex flex-col items-center w-full">
          <div className="flex justify-between items-center w-full mb-4">
          <h2 className="text-2xl font-bold text-green-700 mb-6 border-b-2 border-green-400 pb-2">
            Calendar
          </h2>
            <button 
              onClick={() => navigate("/pediatrician/calendar")} 
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all"
            >
              Add Availability
            </button>
          </div>
          <div className="w-full max-w-[500px]">
            <Calendar
              onChange={(newDate) => setDate(newDate)}
              value={date}
              className="react-calendar w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 mb-8">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowAppointments(!showAppointments)}
        >
          <h2 className="text-2xl font-bold text-green-700 mb-6 border-b-2 border-green-400 pb-2">
            Upcoming Appointments
          </h2>
          <span className="text-green-700 text-xl">
            {showAppointments ? <FaCaretUp /> : <FaCaretDown />}
          </span>
        </div>
        {showAppointments && (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {appointments.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {appointments.map((appointment) => (
                  <li
                    key={appointment.appointmentId}
                    className="p-5 bg-gray-50 shadow-md rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-medium text-green-900">
                          {appointment.patientFullName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          <strong>Date:</strong>{" "}
                          {new Date(appointment.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Time:</strong>{" "}
                          {moment(appointment.timeStart, "HH:mm:ss").format("h:mm A")} -{" "}
                          {moment(appointment.timeEnd, "HH:mm:ss").format("h:mm A")}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Status:</strong> {appointment.status}
                        </p>
                      </div>
                      <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all">
                        View Details
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-700 font-light">
                No upcoming appointments scheduled yet.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Upcoming Consultations */}
      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 mb-8">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowConsultations(!showConsultations)}
        >
          <h2 className="text-2xl font-bold text-green-700 mb-6 border-b-2 border-green-400 pb-2">
            Upcoming Consultations
          </h2>
          <span className="text-green-700 text-xl">
            {showConsultations ? <FaCaretUp /> : <FaCaretDown />}
          </span>
        </div>
        {showConsultations && (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {consultations.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {consultations.map((consultation) => (
                  <li
                    key={consultation.consultationId}
                    className="p-5 bg-gray-50 shadow-md rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-medium text-green-900">
                          {consultation.patientFullName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          <strong>Date:</strong>{" "}
                          {new Date(consultation.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Time:</strong>{" "}
                          {moment(consultation.timeStart, "HH:mm:ss").format("h:mm A")} -{" "}
                          {moment(consultation.timeEnd, "HH:mm:ss").format("h:mm A")}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Status:</strong> {consultation.status}
                        </p>
                      </div>
                      <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all">
                        View Details
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-700 font-light">
                No upcoming consultations scheduled yet.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal for Selected Date */}
      {modalData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">
              {selectedDate} -{" "}
              {modalData.status === "available" ? "Available" : "Not Available"}
            </h3>
            <p>
              <strong>Name:</strong> {modalData.name}
            </p>
            <p>
              <strong>Email:</strong> {modalData.email}
            </p>
            <p>
              <strong>Status:</strong> {modalData.status}
            </p>
            {modalData.timeSlots && (
              <p>
                <strong>Time Slots:</strong>{" "}
                {modalData.timeSlots.join(", ")}
              </p>
            )}
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default PediatricianDashboard;