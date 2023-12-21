import React, { useEffect, useState, useRef } from 'react';
// import ChannelsBar from '../components/Chat/ChannelsBar';
import ChatBody from '../components/Chat/ChatBody';
import ChatFooter from '../components/Chat/ChatFooter';
import ChatUsers from '../components/Chat/ChatUsers';
import io from "socket.io-client";

const ChatPage = ({ socket, room }) => {
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (room.current) {
      socket.current = io("http://localhost:4000", {
        query: { roomId: room.current },
      });
    } else {
      room.current = "local";
    }
    socket.current.emit("newUser", localStorage.getItem('userName'));
    return () => {
      socket.current.disconnect();
    };
  }, [room.current]);

  useEffect(() => {
    socket.current.on('fileResponse', (data) => setFiles(data));
    socket.current.on('messageResponse', (data) => setMessages([...messages, data]));
    socket.current.on('typingResponse', (data) => setTypingStatus(data));

    return () => {
      socket.current.off('fileResponse');
      socket.current.off('messageResponse');
      socket.current.off('typingResponse');
    }
  }, []);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat">
      <ChatUsers socket={socket} room={room} />
      <div className="chat__main">
        <ChatBody
          messages={messages}
          typingStatus={typingStatus}
          lastMessageRef={lastMessageRef}
          files={files}
          socket={socket}
          room={room}
        />
        <ChatFooter socket={socket} room={room} />
      </div>
    </div>
  );
};

export default ChatPage;