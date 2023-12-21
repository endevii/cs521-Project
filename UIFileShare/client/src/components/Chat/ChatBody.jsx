import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconFileTypeDoc } from '@tabler/icons-react';

const ChatBody = ({ messages, lastMessageRef, typingStatus, socket }) => {
  const navigate = useNavigate();

  const handleLeaveChat = () => {
    socket.emit('disconnectUser');
    localStorage.removeItem('userName');
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <header className="chat__mainHeader">
        <p>Send Files and Chat</p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>

      <div className="message__container">
        {messages.map((message) =>
          message.name === localStorage.getItem('userName') ? (
            message.type === "text" ? (
              <div className="message__chats" key={message.id}>
                <p className="sender__name">You</p>
                <div className="message__sender">
                  <p>{message.text}</p>
                </div>
              </div>
            ) : (
              <div className="message__chats" key={message.id}>
                <p className="sender__name">You</p>
                <div className="file__sender">
                  <IconFileTypeDoc /><a href={message.fileURL} className='file__link'>{message.text}</a>
                </div>
              </div>
            )
          ) : (message.type === "text" ? (
            <div className="message__chats" key={message.id}>
              <p>{message.name}</p>
              <div className="message__recipient">
                <p>{message.text}</p>
              </div>
            </div>
          ) :
            (
              <div className="message__chats" key={message.id}>
                <p>{message.name}</p>
                <div className="file__recipient">
                  <IconFileTypeDoc /><a href={message.fileURL} className='file__link'>{message.text}</a>
                </div>
              </div>
            ))
        )}

        <div ref={lastMessageRef} />
        <div className="message__status">
          <p>{typingStatus}</p>
        </div>
      </div>
    </>
  );
};

export default ChatBody;