import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../Available.css";
import moment from "moment-timezone";
import { jwtDecode } from "jwt-decode";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const MyCalendar = () => {
  const [availability, setAvailability] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    timeSlots: [],
    status: "available",
  });
  const [availableSlots, setAvailableSlots] = useState([
    "08:00 AM - 09:00 AM",
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
  ]);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  // Fetch marked dates
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
        const formattedMarkedDates = Object.keys(response.data).reduce((acc, date) => {
          acc[date] = response.data[date];
          return acc;
        }, {});
        setMarkedDates(formattedMarkedDates);
      }
    } catch (error) {
      console.error("Failed to fetch marked dates:", error);
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/user-data`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const { name, email } = response.data;
        setFormData((prevData) => ({
          ...prevData,
          name,
          email,
        }));
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
    fetchMarkedDates();
  }, []);

  const handleTileClick = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const today = moment().format("YYYY-MM-DD");

    if (moment(formattedDate).isBefore(today)) {
      alert("You cannot set a schedule for past dates.");
      return;
    }

    setSelectedDate(formattedDate);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTimeSlotChange = (slot) => {
    setFormData((prevData) => {
      const isSelected = prevData.timeSlots.includes(slot);
      const newTimeSlots = isSelected
        ? prevData.timeSlots.filter((s) => s !== slot)
        : [...prevData.timeSlots, slot];
      return { ...prevData, timeSlots: newTimeSlots };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    const today = moment().format("YYYY-MM-DD");

    if (moment(formattedDate).isBefore(today)) {
      alert("You cannot set a schedule for past dates.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${apiBaseUrl}/api/availability`,
        {
          date: formattedDate,
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Availability status set successfully!");
      await fetchMarkedDates(); // Re-fetch updated marked dates
      setIsModalOpen(false);
      setFormData((prevData) => ({ ...prevData, timeSlots: [], status: "available" }));
    } catch (error) {
      console.error("Failed to set availability:", error);
      alert("Error setting availability.");
    }
  };

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

  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      const today = moment().startOf("day");
      return moment(date).isBefore(today);
    }
    return false;
  };

  return (
    <div className="flex flex-row w-full h-screen">
      <div className="w-3/4 p-6 bg-gray-100">
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-3xl font-bold text-green-700 mb-2">Calendar</h2>
          <p className="text-xl text-gray-500 mb-8">View and Click the Date to Set Availability</p>
          <div className="calendar-wrapper">
            <Calendar
              tileClassName={tileClassName}
              tileDisabled={tileDisabled}
              onClickDay={handleTileClick}
              className="custom-calendar"
            />
          </div>
        </div>
      </div>
      <div className="w-1/4 p-6 bg-white">
        {selectedDate ? (
          <div>
            <h2 className="text-lg font-semibold text-gray-700">
              Set Availability for {selectedDate}
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                  readOnly
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                  readOnly
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Select Time Slots</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableSlots.map((slot, index) => (
                    <label key={index} className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        value={slot}
                        checked={formData.timeSlots.includes(slot)}
                        onChange={() => handleTimeSlotChange(slot)}
                        className="form-checkbox"
                      />
                      <span>{slot}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm"
                  required
                >
                  <option value="available">Available</option>
                  <option value="not_available">Not Available</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        ) : (
          <p className="text-gray-500">Click a date on the calendar to set availability.</p>
        )}
      </div>
    </div>
  );
};

export default MyCalendar;
