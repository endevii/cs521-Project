const express = require('express');
const app = express();
const PORT = 3001;
const bcrypt = require('bcrypt');
const saltRounds = 10;
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

// let users = [];
// let files = [];
let channels = {
  "local": {
    users: [],
    files: [],
    messages: [],
    password: null
  }
};

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

socketIO.on('connection', async (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  let { roomId } = socket.handshake.query;
  await socket.join(roomId);

  socket.on('createChannel', (data) => {
    let password = data.password;
    if (password !== null) {
      password = bcrypt.hashSync(password, saltRounds);
    }
    channels[data.channel] = {
      users: [],
      files: [],
      messages: [],
      password: password
    };
    socketIO.emit('channelResponse', channels);
  });

  socket.on('joinChannel', (data) => {
    let password = data.password;
    if (channels[data.channel].password !== null) {
      if (!bcrypt.compareSync(password, channels[data.channel].password)) {
        socketIO.to(socket.id).emit('channelErrorResponse', "Incorrect password");
        return;
      }
    }
    channels[data.channel].users.push(data.user);
    socketIO.to(data.channel).emit('channelResponse', channels);
  });

  socket.on('leaveChannel', (data) => {
    channels[data.channel].users = channels[data.channel].users.filter((user) => user.socketID !== socket.id);
    socketIO.emit('channelResponse', channels);
  });

  socket.on('message', (data, channel) => {
    socketIO.to(channel).emit('messageResponse', data);
  });

  socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

  socket.on('newUser', (data) => {
    users.push(data);
    channels["local"].users = [...channels["local"].users, data];
    console.log(channels);
    socket.join("local");
    socketIO.to("local").emit('newUserResponse', channels["local"].users);
  });

  socket.on('file', (data) => {
    console.log(data);
    let channel = data.channel;
    const fileURL = saveFile(data.file, data.fileName);
    if (!fileURL) {
      socketIO.to(channel).emit('fileResponse', 'Error saving file');
      return;
    }
    const file = {
      fileURL,
      name: data.fileName,
    };

    channels[channel].files.push(file);
    socketIO.to(channel).emit('fileResponse', channels[channel].files);
    socketIO.to(channel).emit('messageResponse', {
      type: 'file',
      name: data.name,
      text: `${file.name}`,
      fileURL,
      id: `${socket.id}${Math.random()}`,
      socketID: socket.id,
    });
  });

  socket.on('disconnectUser', (channel) => {
    console.log('🔥: A user disconnected');
    channels[channel].users = channels[channel].users.filter((user) => user.socketID !== socket.id);
    socketIO.to(channel).emit('newUserResponse', channels[channel].users);
    socket.disconnect();
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    for (const channel in channels) {
      channels[channel].users = channels[channel].users.filter((user) => user.socketID !== socket.id);
      socketIO.to(channel).emit('newUserResponse', channels[channel].users);
    }
    // users = users.filter((user) => user.socketID !== socket.id);
    // socketIO.emit('newUserResponse', users);
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