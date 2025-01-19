import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import  VideoCallModal  from './VideoCallModal';
import VideoCall from '../Pediatrician/VideoCall';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const socket = io(`${apiBaseUrl}`);

const GuardianChat = () => {
  const [messages, setMessages] = useState([]);
  const [incomingCall, setIncomingCall] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const dta = localStorage.getItem('token')
  const user_data = jwtDecode(dta)
  console.log(user_data)
  
  
  useEffect(() => {
    socket.on('ReceiveCall', (data) => {
      if(data === user_data.id) return setIncomingCall(true);
    })
  },[])

  useEffect(() => {
    axios.get(`${apiBaseUrl}/api/guardian-msg/${user_data.id}`,{
        headers: { 'Authorization': `Bearer ${dta}`}
    })
        .then(res => {
          
          setMessages(res.data)
        })
        .catch(err => console.log(err))
  },[]);


  useEffect(() => {
    socket.on('newMessage', (data) => {
        console.log(data)
        setMessages(data);
    })
  }, []);

  console.log(incomingCall)


  const handleSendMessage = () => {
    
      const conversation_id = messages[0]?.conversation_id
      const sender_id = user_data.id
      const content = newMessage
    
      if(conversation_id > 0) {
        axios.post(`${apiBaseUrl}/api/guardian-send-msg/`,{
        conversation_id,
        sender_id,
        content
      },{
        headers: { 'Authorization': `Bearer ${dta}`}
      })
        .then(res => {
          setMessages(res.data)
          setNewMessage('')
          console.log(res.data)
        })
        .catch(err => console.log(err))
      }

      if(conversation_id === undefined) {
        axios.post(`${apiBaseUrl}/api/create-conversation`, {
          participant_1: sender_id,
        }, {headers: { 'Authorization': `Bearer ${dta}`}
        }).then((res) => {
          const {id} = res.data;
          axios.post(`${apiBaseUrl}/api/send-new-msg`, {
            conversation_id: id,
            sender_id,
            content
          }, {
            headers: { 'Authorization': `Bearer ${dta}`}
          })
          .then((res) => setMessages(res.data))
          .catch((err) => console.log(err))
          // setNewMessage(res.data)
        }).catch((err) => console.log(err))
        setNewMessage('')
  };


}

if(incomingCall){
  return(
      <VideoCallModal user={user_data.email} setIncomingCall={setIncomingCall}/>
  )
}
  return (
    <div className="flex flex-col bg-gray-100 p-8 h-screen">

      {/* Start Chat Message */}
      <div className="text-center mb-6 text-lg text-green-800 font-semibold">
        <p>Start a chat with Dr. Urcia</p>
        <p onClick={() => setIncomingCall(true)} className='font-bold hover:text-blue-500 cursor-pointer'>JOIN ROOM</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow-lg overflow-y-auto mb-6">
        {messages?.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === user_data.id ? 'justify-end' : 'justify-start'} mb-4`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-lg shadow-lg ${
                message.sender !== user_data.id 
                  ? 'bg-green-100 text-green-900 rounded-br-none'
                  : 'bg-blue-500 text-white rounded-bl-none'
              }`}
            >
              <p className="font-medium text-white">{message.sender === user_data.id ? 'You' : 'Dr. Urcia'}</p>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GuardianChat;
