import React, { useState } from 'react';

const Notifications = () => {
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
      message: 'Your consultation request for Jane Doe has been approved.',
      timestamp: '2024-10-15 15:00',
      read: false,
    },
    {
      id: 3,
      title: 'System Maintenance',
      message: 'The system will undergo maintenance on October 20, 2024.',
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
    <div className="p-6 bg-white h-screen flex flex-col">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Notifications</h2>
      <div className="flex-grow overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-gray-500">You have no new notifications.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg shadow-lg border ${
                  notification.read ? 'bg-gray-100' : 'bg-green-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-green-800">
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
                <p className="text-gray-700 mt-2">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
