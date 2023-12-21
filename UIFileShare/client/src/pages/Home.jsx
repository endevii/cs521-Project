import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ socket }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    if (userName) {
      socket.emit('newUser', { userName, socketID: socket.id });
      navigate('/chat');
    }
  }, [navigate, socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName.length === 0) {
      setError('Please enter a username');
      return;
    } else if (userName.length < 6) {
      setError('Username must be at least 6 characters long');
      return;
    }
    localStorage.setItem('userName', userName);
    //sends the username and socket ID to the Node.js server
    socket.emit('newUser', { userName, socketID: socket.id });
    navigate('/chat');
  };
  return (
    <form className="home__container" onSubmit={handleSubmit}>
      <h2 className="home__header">Sign in to Send Files</h2>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        id="username"
        className="username__input"
        value={userName}
        onChange={(e) => {
          setUserName(e.target.value);
          setError('');
        }}
      />
      {error.length > 0 && (
        <p className="home__error error">
          <i className="fas fa-exclamation-circle"></i> {error}
        </p>

      )}
      <button className="home__cta">SIGN IN</button>
    </form>
  );
};

export default Home;