import React, { useState } from 'react';

const GuardianNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Appointment Reminder',
      message: 'Your appointment with Dr. Smith is scheduled for tomorrow at 10:00 AM.',
      timestamp: '2024-10-16 12:30',
      read: false,
    },
    {
      id: 2,
      title: 'Consultation Request Approved',
      message: 'Your consultation request for Jane Doe has been approved and confirmed.',
      timestamp: '2024-10-15 15:00',
      read: false,
    },
    {
      id: 3,
      title: 'Scheduled System Maintenance',
      message: 'Our system will undergo scheduled maintenance on October 20, 2024, from 2:00 AM to 4:00 AM.',
      timestamp: '2024-10-14 09:00',
      read: true,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <div className="p-8 bg-gray-50 h-screen flex flex-col">
      <div className="flex-grow overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-lg text-center">You have no new notifications.</p>
        ) : (
          <div className="space-y-6">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 rounded-lg shadow-md border-2 ${
                  notification.read ? 'bg-gray-100 border-gray-300' : 'bg-green-50 border-green-300'
                } transition-all duration-300 ease-in-out`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-green-800">{notification.title}</h3>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
                <p className="text-gray-700 mt-2 text-lg">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuardianNotifications;
