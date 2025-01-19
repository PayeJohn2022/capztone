import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import io from 'socket.io-client';
import VideoCall from './VideoCall';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const socket = io(`${apiBaseUrl}`);

const Chat = () => {
    const [newMessage, setNewMessage] = useState();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [participant, setParticipant] = useState([]);  // This is an array
    const [receiver, setReceiver] = useState();
    const [calling, setCalling] = useState(false);
    const messageEndRef = useRef(null);

    const dta = localStorage.getItem('token');
    const user_data = jwtDecode(dta);

    useEffect(() => {
        axios.get(`${apiBaseUrl}/api/conversation/${user_data.id}`, {
            headers: { 'Authorization': `Bearer ${dta}` }
        })
            .then(res => {
                setParticipant(res.data || []);  // Ensure it’s always an array
                if (res.data && res.data[0]) {
                    const { user, email, conversation_id, firstname, lastname } = res.data[0];
                    setReceiver({ user, email, conversation_id, firstname, lastname });
                }
            })
            .catch(err => console.log(err));
    }, [newMessage]);

    useEffect(() => {
        socket.on('UserFirstMsg', (data) => {
            setNewMessage(data);
        });
    }, []);

    useEffect(() => {
        socket.on('newMessage', (data) => {
            setMessages(data);
        });
    }, []);

    useEffect(() => {
        if (receiver) {
            axios.get(`${apiBaseUrl}/api/messages/${receiver.conversation_id}`, {
                headers: { 'Authorization': `Bearer ${dta}` }
            })
                .then(res => {
                    setMessages(res.data);
                })
                .catch(err => console.log(err));
        }
    }, [receiver]);

    function messageUser(user, conversation_id, email, firstname, lastname) {
        setReceiver({ user, email, conversation_id, firstname, lastname });
    }

    const submitMessage = (e) => {
        e.preventDefault();

        const conversation_id = receiver.conversation_id;
        const content = message;
        const sender_id = user_data.id;

        axios.post(`${apiBaseUrl}/api/pedia-send-msg`, {
            sender_id,
            conversation_id,
            content
        }, {
            headers: { 'Authorization': `Bearer ${dta}` }
        }).then(
            scrollToBottom()
        )
            .catch(err => console.log(err));
    };

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom(); // Scroll to the bottom whenever messages change
    }, [messages]);

    const callTheGuardian = () => {
        setCalling(true);
        socket.emit('',);
    };

    if (calling) {
        return (
            <VideoCall user={receiver.firstname + receiver.lastname} setCalling={setCalling} calling={calling} conversation_id={receiver.user} />
        );
    }

    return (
        <div className='flex h-[100vh] overflow-auto'>
            <div className='flex-[0.4] border-slate-300 border-r-2 overflow-auto'>
                <p className='text-center bg-slate-400 p-5 font-semibold sticky top-0'>Messages</p>
                {Array.isArray(participant) && participant.length > 0 && participant.map((user, index) => user.email !== user_data.email && (
                    <div key={index} className={`flex flex-row justify-start px-2 py-2 items-center border-b-2 cursor-pointer`} onClick={() => messageUser(user.user, user.conversation_id, user.email, user.firstname, user.lastname)}>
                        <div className='bg-slate-300 w-12 h-12 overflow-hidden rounded-full'>
                            <img src="https://scontent.fcgy1-1.fna.fbcdn.net/v/t39.30808-6/458287996_2296422620724536_3058798539142498857_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF9JJ5YFi1EUJUWt1rrJKn8VVVwvq1dmsNVVXC-rV2aw8gLQQ8pFPw5iIILH5V5v0GqhrzupKEoYHrkhSr4iwCr&_nc_ohc=Omuv3lITYRwQ7kNvgH4UoXf&_nc_zt=23&_nc_ht=scontent.fcgy1-1.fna&_nc_gid=AkYI73YzIche_iPSBzNVU5s&oh=00_AYCRwP0WzCL6s2uZipTxPJtttCI-5VbfHwKf1zHbZCanDQ&oe=67798802" alt="" />
                        </div>
                        <p className='text-center flex-1'>{user.firstname + " " + user.lastname}</p>
                    </div>
                ))}
            </div>
            <div className='flex flex-col flex-1 justify-between'>
                <div className='flex flex-row items-center justify-between py-3 bg-green-500 px-2'>
                    <div className='flex flex-row items-center justify-between space-x-2'>
                        <div className='bg-slate-300 border w-12 h-12 overflow-hidden rounded-full'>
                            <img src="https://scontent.fcgy1-1.fna.fbcdn.net/v/t39.30808-6/458287996_2296422620724536_3058798539142498857_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeF9JJ5YFi1EUJUWt1rrJKn8VVVwvq1dmsNVVXC-rV2aw8gLQQ8pFPw5iIILH5V5v0GqhrzupKEoYHrkhSr4iwCr&_nc_ohc=Omuv3lITYRwQ7kNvgH4UoXf&_nc_zt=23&_nc_ht=scontent.fcgy1-1.fna&_nc_gid=AkYI73YzIche_iPSBzNVU5s&oh=00_AYCRwP0WzCL6s2uZipTxPJtttCI-5VbfHwKf1zHbZCanDQ&oe=67798802" alt="" />
                        </div>
                        {receiver?.firstname && receiver?.lastname ? (
                              <p>{receiver?.firstname} {receiver?.lastname}</p>
                          ) : (
                              <p>{participant[0]?.firstname} {participant[0]?.lastname}</p>
                          )}
                    </div>
                    <div onClick={callTheGuardian} className='bg-yellow-400 rounded-lg px-8 py-2'>
                        <button>Create Room</button>
                    </div>
                </div>
                <form onSubmit={submitMessage} className='flex flex-col flex-1 py-2 justify-between overflow-auto'>
                    <div className='px-2 py-2'>
                        <div className='justify-start items-center space-y-2 flex flex-1 flex-col'>
                            {messages.map((i, idx) => i.sender !== user_data.id ? (
                                <p key={idx} className='self-start rounded-lg bg-slate-500 p-2 text-white'>{i.content}</p>
                            ) : (
                                <p key={idx} className='self-end rounded-lg bg-blue-500 p-2 text-white'><span className='font-semibold'>You <br /></span>{i.content}</p>
                            ))}
                        </div>
                        <div ref={messageEndRef} />
                    </div>
                    <div className='w-full flex flex-row px-2 space-x-1'>
                        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Message Here' className='flex-1' />
                        <button type='submit' className='py-2 px-8 bg-green-500'>Send</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Chat;
