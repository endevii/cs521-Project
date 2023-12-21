import React, { useState, useRef } from 'react';
import { IconFileX, IconFileUpload } from '@tabler/icons-react';
import { Tooltip } from '@mantine/core';

const ChatFooter = ({ socket }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const hiddenFileInput = useRef(null);

  const handleTyping = () =>
    socket.emit('typing', `${localStorage.getItem('userName')} is typing`);

  const handleDoneTyping = () =>
    setTimeout(() => socket.emit('typing', ""), 5000);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem('userName')) {
      socket.emit('message', {
        type: 'text',
        text: message,
        name: localStorage.getItem('userName'),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
      socket.emit('typing', "")
    }
    if (file) {
      let formData = {};
      formData['file'] = file;
      formData['fileName'] = file['name'];
      formData['name'] = localStorage.getItem('userName');
      formData['id'] = `${socket.id}${Math.random()}`;
      console.log(formData);
      socket.emit('file', formData);
    }
    setMessage('');
    setFile(null);
  };

  const handleClick = event => {
    hiddenFileInput.current.click();
  };


  const handleFileChange = (e) => {
    const fileChanged = e.target.files[0];
    console.log(fileChanged);
    if (fileChanged && fileChanged !== undefined) {
      setFile(fileChanged);
    }
  }
  return (
    <div className="chat__footer">
      <div>
        <Tooltip label={file === null ? "Select a File" : "Change File"} position="top">
          <button className="shareBtn" onClick={handleClick}>{file !== null ? < IconFileX /> : < IconFileUpload />} </button>
        </Tooltip>
        <input type="file" onChange={handleFileChange} ref={hiddenFileInput} style={{ display: 'none' }} />
      </div>
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
          onKeyUp={handleDoneTyping}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;