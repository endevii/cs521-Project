import React, { useEffect, useState, useRef } from 'react';
// import ChannelsBar from '../components/Chat/ChannelsBar';
import ChatBody from '../components/Chat/ChatBody';
import ChatFooter from '../components/Chat/ChatFooter';
import ChatUsers from '../components/Chat/ChatUsers';

const ChatPage = ({ socket }) => {
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [typingStatus, setTypingStatus] = useState('');
  const lastMessageRef = useRef(null);

  useEffect(() => {
    socket.on('fileResponse', (data) => setFiles(data));
  }, [socket, files]);

  useEffect(() => {
    socket.on('messageResponse', (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    socket.on('typingResponse', (data) => setTypingStatus(data));
  }, [socket]);

  return (
    <div className="chat">
      <ChatUsers socket={socket} />
      <div className="chat__main">
        <ChatBody
          messages={messages}
          typingStatus={typingStatus}
          lastMessageRef={lastMessageRef}
          files={files}
          socket={socket}
        />
        <ChatFooter socket={socket} />
      </div>
    </div>
  );
};

export default ChatPage;