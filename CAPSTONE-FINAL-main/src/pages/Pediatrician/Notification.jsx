import React, { useContext } from 'react';

import { SocketContext } from '../../components/Context';

const Notification = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);

  return (
    <>
     {call.isReceivingCall && !callAccepted && (
        <div>
        <h1 className="text-xl font-semibold">{call.name} is calling:</h1>
        <button
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
        onClick={answerCall}
        >
      Answer
    </button>
  </div>
)}

    </>
  );
};

export default Notification;