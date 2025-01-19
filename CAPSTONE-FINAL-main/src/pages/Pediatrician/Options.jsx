import React, { useState, useContext } from 'react';
import { SocketContext } from '../../components/Context';
// import { Assignment, Phone, PhoneDisabled } from '@material-ui/icons';

const Options = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');

  return (
    <div className="flex flex-col items-center w-full p-4">
      <div className="w-full max-w-md p-4 border-2 border-black rounded-md shadow-lg">
        <form className="flex flex-col space-y-4">
          {/* Account Info */}
          <div className="flex flex-col space-y-2">
            <h6 className="text-lg font-semibold">Account Info</h6>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded-md w-full"
            />
          </div>

          {/* Make a Call */}
          <div className="flex flex-col space-y-2">
            <h6 className="text-lg font-semibold">Make a call</h6>
            <input
              type="text"
              placeholder="ID to call"
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
              className="p-2 border rounded-md w-full"
            />
            {callAccepted && !callEnded ? (
              <button
                onClick={leaveCall}
                className="w-full py-2 mt-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                
                Hang Up
              </button>
            ) : (
              <button
                onClick={() => callUser(idToCall)}
                className="w-full py-2 mt-2 text-white bg-green-500 rounded-md hover:bg-green-600"
              >
              
                Call
              </button>
            )}
          </div>
        </form>
        {children}
      </div>
    </div>
  );
};

export default Options;
