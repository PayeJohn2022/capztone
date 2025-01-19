// ParentComponent.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Chat from './Chat';

const ParentComponent = () => {
  const { roomName } = useParams(); // Get roomName from URL params
  const yourID = "yourUniqueUserID"; // Replace with actual user ID

  console.log('Current roomName:', roomName);

  return (
    <div>
      {roomName ? (
        <Chat roomName={roomName} yourID={yourID} />
      ) : (
        <div>Please select a room to start chatting.</div>
      )}
    </div>
  );
};

export default ParentComponent;
