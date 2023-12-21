import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, rem } from '@mantine/core';
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';

const ChatUsers = ({ socket }) => {
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);

  const iconStyle = { width: rem(12), height: rem(12) };

  const fetchData = useCallback(() => {
    socket.emit('fetchUsers');
    socket.emit('fetchFiles');
  }, [socket]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    socket.on('fileResponse', (data) => setFiles(data));
  }, [socket]);

  useEffect(() => {
    socket.on('newUserResponse', (data) => setUsers(data));
  }, [socket]);


  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>
      <Tabs onChange={fetchData} color="rgba(73, 91, 99, 1)" variant="pills" defaultValue="Users">
        <Tabs.List>
          {/* <Tabs.Tab value="Channels" leftSection={<IconPhoto style={iconStyle} />}>
            Channels
          </Tabs.Tab> */}
          <Tabs.Tab value="Users" leftSection={<IconMessageCircle style={iconStyle} />}>
            Users
          </Tabs.Tab>
          <Tabs.Tab value="Files" leftSection={<IconSettings style={iconStyle} />}>
            Files
          </Tabs.Tab>
        </Tabs.List>

        {/* <Tabs.Panel value="Channels">
          <div>
            <h4 className="chat__header">CHANNELS</h4>
            <div className="chat__users">
              {users.map((user) => (
                <p key={user.socketID}>{user.userName}</p>
              ))}
            </div>
          </div>
        </Tabs.Panel> */}

        <Tabs.Panel value="Users">
          <div>
            <h4 className="chat__header">ACTIVE USERS</h4>
            <div className="chat__users">
              {users.map((user) => (
                <p key={user.socketID}>{user.userName}</p>
              ))}
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="Files">
          <div>
            <h4 className="chat__header">ALL FILES</h4>
            <div className="chat__users">
              {files.map((file, index) => (
                <a href={file.fileURL} key={file.name}>{file.name}</a>
              ))}
            </div>
          </div>
        </Tabs.Panel>
      </Tabs>

    </div>
  );
};

export default ChatUsers;