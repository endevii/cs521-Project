import './App.css';
import React, { useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// pages
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';

import socketIO from 'socket.io-client';
// const socket = socketIO.connect('http://localhost:3001');


function App() {
  const socket = useRef();
  const room = useRef();

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} room={room} />}></Route>
          <Route path="/chat" element={<ChatPage socket={socket} room={room} />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
