const express = require('express');
const app = express();
const PORT = 3001;

const http = require('http').Server(app);
const cors = require('cors');
const fs = require('fs');
const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  },
  maxBufferSize: 1e8,
});

app.use(express.static('public'));
app.use(express.json());
app.use(cors());

let users = [];
let files = [];


function saveFile(file, fileName) {
  console.log(file);
  const filePath = `${__dirname}/public/${fileName}`;
  const fileURL = `http://localhost:3001/${fileName}`;

  fs.writeFileSync(filePath, file, (err) => {
    if (err) {
      console.error(err);
      return false;
    }
  });

  return fileURL;
}

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on('message', (data) => {
    socketIO.emit('messageResponse', data);
  });

  socket.on('fetchUsers', () => {
    socketIO.emit('newUserResponse', users);
  });

  socket.on('fetchFiles', () => {
    socketIO.emit('fileResponse', files);
  });

  socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

  socket.on('newUser', (data) => {
    users.push(data);
    console.log(users)
    socketIO.emit('newUserResponse', users);
  });

  socket.on('file', (data) => {
    console.log(data);
    const fileURL = saveFile(data.file, data.fileName);
    if (!fileURL) {
      socketIO.emit('fileResponse', 'Error saving file');
      return;
    }
    const file = {
      fileURL,
      name: data.fileName,
    };
    // console.log(file);
    files.push(file);
    socketIO.emit('fileResponse', files);
    socketIO.emit('messageResponse', {
      type: 'file',
      name: data.name,
      text: `${file.name}`,
      fileURL,
      id: `${socket.id}${Math.random()}`,
      socketID: socket.id,
    });
  });

  socket.on('disconnectUser', () => {
    console.log('🔥: A user disconnected');
    users = users.filter((user) => user.socketID !== socket.id);
    socketIO.emit('newUserResponse', users);
    socket.disconnect();
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(process.env.PORT || 3001, () => {
  console.log(`Listening on port ${PORT}: http://localhost:${PORT}`);
});