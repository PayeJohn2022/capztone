import React, { useEffect, useState,  } from "react";
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../Available.css";
import moment from "moment-timezone";
import { jwtDecode } from "jwt-decode";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const AdminMyCalendar = () => {
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();

  const fetchMarkedDates = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        if (Date.now() >= decoded.exp * 1000) {
          console.error("Token expired");
        }
      }

      const response = await axios.get(`${apiBaseUrl}/api/marked-dates`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && typeof response.data === "object") {
        // Filter out past dates
        const today = moment().startOf("day"); // Start of the current day
        const filteredDates = Object.entries(response.data).reduce((acc, [date, data]) => {
          if (moment(date, "YYYY-MM-DD").isSameOrAfter(today)) {
            acc[date] = data; // Include only present and future dates
          }
          return acc;
        }, {});

        setMarkedDates(filteredDates);
      }
    } catch (error) {
      console.error("Failed to fetch marked dates:", error);
    }
  };

  useEffect(() => {
    fetchMarkedDates();
  }, []);

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      if (markedDates[formattedDate]?.status === "available") {
        return "available"; // Green class
      } else if (markedDates[formattedDate]?.status === "not_available") {
        return "not-available"; // Red class
      }
    }
    return null;
  };

  const handleBack = () => navigate(-1); // Navigate back

  const handleDateClick = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const data = markedDates[formattedDate];
    if (data) {
      setSelectedDate(formattedDate);
      setModalData(data);
    } else {
      setSelectedDate(null);
      setModalData(null);
    }
  };

  const closeModal = () => {
    setSelectedDate(null);
    setModalData(null);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      <button
        onClick={handleBack}
        aria-label="Go back"
        className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <IoArrowBack className="text-lg" />
      </button> 
      <h2 className="text-3xl font-bold text-green-700 mb-5">Pediatrician's Availability</h2>
      <p className="text-xl text-gray-500">View pediatrician schedules below</p>
      <div className="mt-8">
        <Calendar
          tileClassName={tileClassName}
          onClickDay={handleDateClick} // Handle click events
        />
      </div>
      <p className="text-xl text-gray-500 mt-5">Click the date to view the schedules</p>
      {modalData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">
              {selectedDate} - {modalData.status === "available" ? "Available" : "Not Available"}
            </h3>
            <p><strong>Name:</strong> {modalData.name}</p>
            <p><strong>Email:</strong> {modalData.email}</p>
            <p><strong>Status:</strong> {modalData.status}</p>
            {modalData.timeSlots && (
              <p><strong>Time Slots:</strong> {modalData.timeSlots.join(", ")}</p>
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
    </div>
  );
};

export default AdminMyCalendar;
